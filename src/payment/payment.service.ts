import { ObjectId } from "mongodb";
import AppError from "../custom/AppError";
import User from "../user/schema/user.schema";
import Course from "../course/schema/course.schema";
import Order from "./schema/order.schema";
import paypal from "paypal-rest-sdk";
import { Response } from "express";
import { sendMail } from "../util/mail.config";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

interface IBatchItem {
  email: string;

  amount: number;
}

const frontendDomain =
  process.env.NODE_ENV === "development"
    ? process.env.FRONTEND_DOMAIN_DEVELOPMENT
    : process.env.FRONTEND_DOMAIN_PRODUCTION;

const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

paypal.configure({
  mode: PAYPAL_MODE as string, //sandbox or live
  client_id: PAYPAL_CLIENT_KEY as string,
  client_secret: PAYPAL_SECRET_KEY as string,
});

interface ICourse {
  title: string;

  price: number;
}

interface IItem {
  name: string;
  price: string;
  currency: string;
  sku: string;
  quantity: number;
}

export default class PaymentService {
  static addToCart = async (id: string, courses: string[]) => {
    let user = await User.findById(id).exec();
    user?.cart.forEach((item) => {
      if (item.toString() === courses[0])
        throw new AppError("Item already exist", 400);
    });

    user?.cart.push(new ObjectId(courses[0]));
    await user?.save();

    let item = {
      userId: id,
      courseId: courses[0],
    };

    return {
      status: 201,
      message: "Add to cart successfully",
      data: [item],
    };
  };

  static getCart = async (id: string) => {
    let user = await User.findById(id).exec();

    let res = user?.cart.map((item) => {
      return {
        userId: id,
        courseId: item.toString(),
      };
    });

    return {
      status: 200,
      message: "Get cart items successfully",
      data: res,
    };
  };

  static deleteFromCart = async (userId: string, courseId: string) => {
    await User.findByIdAndUpdate(userId, { $pull: { cart: courseId } });

    let item = {
      userId: userId,
      courseId: courseId,
    };

    return {
      status: 200,
      message: "Remove from cart successfully",
      data: [item],
    };
  };

  static createOrder = async (userId: string, courses: string[]) => {
    let courseList = await Course.find({ _id: { $in: courses } });

    let totalPrice = 0;
    courseList.forEach((item) => {
      totalPrice += item.price;
    });

    let res = await Order.create({ userId, totalPrice, courseId: courses });

    return {
      status: 201,
      message: "Create order successfully",
      data: res,
    };
  };

  static getOrder = async (id: string) => {
    let order = await Order.findById(id);
    if (!order) throw new AppError("Order not found", 404);

    return {
      status: 200,
      message: "Get order successfully",
      data: order,
    };
  };

  static updateOrderStatus = async (id: string) => {
    let res = await Order.findByIdAndUpdate(id, { orderStatus: 1 });
    let user = await User.findById(res?.userId);

    const purchasedItems = res?.courseId.filter(
      (id) => !user?.purchasedCourses.includes(id)
    );

    // enroll student to course
    await Course.updateMany(
      { _id: { $in: res?.courseId } },
      { $push: { students: res?.userId } }
    );

    await User.findByIdAndUpdate(res?.userId, {
      $push: { purchasedCourses: { $each: purchasedItems } },
    });

    await this.sendMail(id);

    // const courses = await Course.find({ _id: { $in: res?.courseId } });

    // let payoutData: IBatchItem[] = [];

    // for (const course of courses) {
    //   const instructor = await User.findById(course.creatorId);
    //   const amount = course.price * 0.6;

    //   payoutData.push({
    //     email: instructor?.email as string,
    //     amount,
    //   });
    // }

    // this.processPayout(payoutData);

    return {
      status: 200,
      message: "Update order status successfully",
      data: res,
    };
  };

  static confirmOrder = async (orderId: string, totalPrice: Number) => {
    const backendDomain =
      process.env.NODE_ENV === "development"
        ? process.env.BACKEND_DOMAIN_DEVELOPMENT
        : process.env.BACKEND_DOMAIN_PRODUCTION;

    return {
      status: 200,
      message: "Confirm order successfully",
      data: {
        url: `${backendDomain}/api/v1/payment/checkout?orderId=${orderId}&totalPrice=${totalPrice}`,
      },
    };
  };

  static checkOut = async (
    orderId: string,
    totalPrice: number,
    mobile: boolean,
    res: Response
  ) => {
    const order = await Order.findById(orderId).populate<{
      courseId: ICourse[];
    }>("courseId");
    let items: IItem[] = [];

    if (order) {
      items = order?.courseId.map((course, index) => {
        return {
          name: course.title,
          price: course.price.toFixed(2),
          currency: "USD",
          sku: `00${index + 1}`,
          quantity: 1,
        };
      });
    }

    try {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: mobile
            ? `${frontendDomain}?status=true&orderId=${orderId}`
            : `${frontendDomain}/payment/invoice?orderId=${orderId}`,
          cancel_url: mobile
            ? `${frontendDomain}?status=false&orderId=${orderId}`
            : `${frontendDomain}/payment-cancel`,
        },
        transactions: [
          {
            item_list: {
              items: items,
            },
            amount: {
              currency: "USD",
              total: totalPrice.toFixed(2),
            },
            description: "Cursus courses",
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          if (payment.links) {
            for (let i = 0; i < payment.links?.length; i++) {
              if (payment.links[i].rel === "approval_url") {
                res.redirect(payment.links[i].href);
              }
            }
          }
        }
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  static processPayout = async (data: IBatchItem[]) => {
    const batchs = data.map((item) => {
      return {
        recipient_type: "EMAIL",
        amount: {
          value: item.amount.toFixed(2),
          currency: "USD",
        },
        receiver: item.email,
        note: "Thanks for your patronage!",
        sender_item_id: uuidv4(),
      };
    });

    const create_payout_json = {
      sender_batch_header: {
        sender_batch_id: `Payouts_${uuidv4()}`,
        email_subject: "You have a payout!",
        email_message:
          "You have received a payout! Thanks for using our service!",
      },
      items: batchs,
    };

    paypal.payout.create(
      create_payout_json,
      function (error: any, payout: any) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log("Create Single Payout Response");
          console.log(payout);
        }
      }
    );
  };

  static processTransaction = async (
    payerId: string,
    paymentId: string,
    price: number
  ) => {
    try {
      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: "USD",
              total: price.toFixed(2),
            },
          },
        ],
      };

      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        function (error, payment) {
          if (error) {
            console.log(error.response);
            throw error;
          } else {
            console.log(JSON.stringify(payment));
          }
        }
      );

      return {
        status: 200,
        message: "Ok",
        data: null,
      };
    } catch (error) {
      console.log(error);

      return {
        status: 500,
        message: "Something went wrong",
        data: null,
      };
    }
  };

  static sendMail = async (orderId: string) => {
    const order = await Order.findById(orderId).populate("courseId");
    const user = await User.findById(order?.userId);

    let template = "invoice.ejs";
    let subject = "Cursus Invoice";
    let context = {
      name: user?.username,
      courses: order?.courseId,
      totalPrice: order?.totalPrice,
      homeUrl: frontendDomain,
    };

    await sendMail(template, context, user?.email as string, subject);
  };
}
