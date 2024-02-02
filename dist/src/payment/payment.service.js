"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const AppError_1 = __importDefault(require("../custom/AppError"));
const user_schema_1 = __importDefault(require("../user/schema/user.schema"));
const course_schema_1 = __importDefault(require("../course/schema/course.schema"));
const order_schema_1 = __importDefault(require("./schema/order.schema"));
const paypal_rest_sdk_1 = __importDefault(require("paypal-rest-sdk"));
const mail_config_1 = require("../util/mail.config");
require("dotenv").config();
const frontendDomain = process.env.NODE_ENV === "development"
    ? process.env.FRONTEND_DOMAIN_DEVELOPMENT
    : process.env.FRONTEND_DOMAIN_PRODUCTION;
const { PAYPAL_MODE, PAYPAL_CLIENT_KEY, PAYPAL_SECRET_KEY } = process.env;
paypal_rest_sdk_1.default.configure({
    mode: PAYPAL_MODE, //sandbox or live
    client_id: PAYPAL_CLIENT_KEY,
    client_secret: PAYPAL_SECRET_KEY,
});
class PaymentService {
}
_a = PaymentService;
PaymentService.addToCart = (id, courses) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_schema_1.default.findById(id).exec();
    user === null || user === void 0 ? void 0 : user.cart.forEach((item) => {
        if (item.toString() === courses[0])
            throw new AppError_1.default("Item already exist", 400);
    });
    user === null || user === void 0 ? void 0 : user.cart.push(new mongodb_1.ObjectId(courses[0]));
    yield (user === null || user === void 0 ? void 0 : user.save());
    let item = {
        userId: id,
        courseId: courses[0],
    };
    return {
        status: 201,
        message: "Add to cart successfully",
        data: [item],
    };
});
PaymentService.getCart = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_schema_1.default.findById(id).exec();
    let res = user === null || user === void 0 ? void 0 : user.cart.map((item) => {
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
});
PaymentService.deleteFromCart = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_schema_1.default.findByIdAndUpdate(userId, { $pull: { cart: courseId } });
    let item = {
        userId: userId,
        courseId: courseId,
    };
    return {
        status: 200,
        message: "Remove from cart successfully",
        data: [item],
    };
});
PaymentService.createOrder = (userId, courses) => __awaiter(void 0, void 0, void 0, function* () {
    let courseList = yield course_schema_1.default.find({ _id: { $in: courses } });
    let totalPrice = 0;
    courseList.forEach((item) => {
        totalPrice += item.price;
    });
    let res = yield order_schema_1.default.create({ userId, totalPrice, courseId: courses });
    return {
        status: 201,
        message: "Create order successfully",
        data: res,
    };
});
PaymentService.getOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let order = yield order_schema_1.default.findById(id);
    if (!order)
        throw new AppError_1.default("Order not found", 404);
    return {
        status: 200,
        message: "Get order successfully",
        data: order,
    };
});
PaymentService.updateOrderStatus = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield order_schema_1.default.findByIdAndUpdate(id, { orderStatus: 1 });
    // enroll student to course
    yield course_schema_1.default.updateMany({ _id: { $in: res === null || res === void 0 ? void 0 : res.courseId } }, { $push: { students: res === null || res === void 0 ? void 0 : res.userId } });
    yield user_schema_1.default.findByIdAndUpdate(res === null || res === void 0 ? void 0 : res.userId, {
        $push: { purchasedCourses: { $each: res === null || res === void 0 ? void 0 : res.courseId } },
    });
    yield _a.sendMail(id);
    return {
        status: 200,
        message: "Update order status successfully",
        data: res,
    };
});
PaymentService.confirmOrder = (orderId, totalPrice) => __awaiter(void 0, void 0, void 0, function* () {
    const backendDomain = process.env.NODE_ENV === "development"
        ? process.env.BACKEND_DOMAIN_DEVELOPMENT
        : process.env.BACKEND_DOMAIN_PRODUCTION;
    return {
        status: 200,
        message: "Confirm order successfully",
        data: {
            url: `${backendDomain}/api/v1/payment/checkout?orderId=${orderId}&totalPrice=${totalPrice}`,
        },
    };
});
PaymentService.checkOut = (orderId, totalPrice, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const create_payment_json = {
            intent: "sale",
            payer: {
                payment_method: "paypal",
            },
            redirect_urls: {
                return_url: `${frontendDomain}/payment/invoice?orderId=${orderId}`,
                cancel_url: `${frontendDomain}/payment-cancel`,
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
        paypal_rest_sdk_1.default.payment.create(create_payment_json, function (error, payment) {
            var _b;
            if (error) {
                throw error;
            }
            else {
                if (payment.links) {
                    for (let i = 0; i < ((_b = payment.links) === null || _b === void 0 ? void 0 : _b.length); i++) {
                        if (payment.links[i].rel === "approval_url") {
                            res.redirect(payment.links[i].href);
                        }
                    }
                }
            }
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
PaymentService.sendMail = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_schema_1.default.findById(orderId).populate("courseId");
    const user = yield user_schema_1.default.findById(order === null || order === void 0 ? void 0 : order.userId);
    let template = "invoice.ejs";
    let subject = "Cursus Invoice";
    let context = {
        name: user === null || user === void 0 ? void 0 : user.username,
        courses: order === null || order === void 0 ? void 0 : order.courseId,
        totalPrice: order === null || order === void 0 ? void 0 : order.totalPrice,
        homeUrl: frontendDomain,
    };
    yield (0, mail_config_1.sendMail)(template, context, user === null || user === void 0 ? void 0 : user.email, subject);
});
exports.default = PaymentService;
