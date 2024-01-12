import { ObjectId } from "mongodb";
import AppError from "../custom/AppError";
import User from "../user/schema/user.schema";
import Course from "../course/schema/course.schema";
import Order from "./schema/order.schema";
import paypal from "paypal-rest-sdk";
import { Response } from "express";
import transporter from "../util/mail.config";
import ejs from "ejs";
import FileService from "../file/file.service";
import { join } from "path";
require("dotenv").config();

const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;

paypal.configure({
  mode: PAYPAL_MODE as string, //sandbox or live
  client_id: PAYPAL_CLIENT_KEY as string,
  client_secret: PAYPAL_SECRET_KEY as string,
});

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
    await this.sendMail(id);

    return {
      status: 200,
      message: "Update order status successfully",
      data: res,
    };
  };

  static confirmOrder = async (orderId: string, totalPrice: Number) => {
    return {
      status: 200,
      message: "Confirm order successfully",
      data: {
        url: `http://localhost:8080/api/v1/payment/checkout?orderId=${orderId}&totalPrice=${totalPrice}`,
      },
    };
  };

  static checkOut = async (
    orderId: string,
    totalPrice: number,
    res: Response
  ) => {
    try {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `http://localhost:3000/payment/invoice?orderId=${orderId}`,
          cancel_url: "http://localhost:3000/payment-cancel",
        },
        transactions: [
          {
            item_list: {
              items: [],
            },
            amount: {
              currency: "USD",
              total: totalPrice.toFixed(2),
            },
            description: "Cursus's course",
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

  static sendMail = async (orderId: string) => {
    const order = await Order.findById(orderId).populate("courseId");
    const user = await User.findById(order?.userId);

    let html = await ejs.renderFile(
      join(FileService.getRootPath(), `src/views/invoice.ejs`),
      {
        name: user?.username,
        courses: order?.courseId,
        totalPrice: order?.totalPrice,
      }
    );

    const mailOptions = {
      from: process.env.SENDER_EMAIL as string,
      to: user?.email as string,
      subject: "Cursus Invoice",
      html: html, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else console.log("Email sent: ", info.response);
    });
  };
}
