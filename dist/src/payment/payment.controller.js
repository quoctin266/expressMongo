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
Object.defineProperty(exports, "__esModule", { value: true });
const payment_service_1 = __importDefault(require("./payment.service"));
class PaymentController {
    static addCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { courses } = req.body;
            let result = yield payment_service_1.default.addToCart(id, courses);
            res.status(result.status).json(result);
        });
    }
    static getCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let result = yield payment_service_1.default.getCart(id);
            res.status(result.status).json(result);
        });
    }
    static removeFromCart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, courseId } = req.params;
            let result = yield payment_service_1.default.deleteFromCart(userId, courseId);
            res.status(result.status).json(result);
        });
    }
    static createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, coursesId } = req.body;
            let result = yield payment_service_1.default.createOrder(userId, coursesId);
            res.status(result.status).json(result);
        });
    }
    static confirmOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId, totalPrice } = req.body;
            let result = yield payment_service_1.default.confirmOrder(orderId, +totalPrice);
            res.status(result.status).json(result);
        });
    }
    static checkOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId, totalPrice } = req.query;
            yield payment_service_1.default.checkOut(orderId, +totalPrice, res);
        });
    }
    static getOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let result = yield payment_service_1.default.getOrder(id);
            res.status(result.status).json(result);
        });
    }
    static updateOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            let result = yield payment_service_1.default.updateOrderStatus(id);
            res.status(result.status).json(result);
        });
    }
    static sendMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId } = req.params;
            yield payment_service_1.default.sendMail(orderId);
            res.status(200).json("ok");
        });
    }
}
exports.default = PaymentController;
