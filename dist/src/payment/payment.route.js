"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const payment_controller_1 = __importDefault(require("./payment.controller"));
const router = express_1.default.Router();
// const validateCreateCategory = {
//   name: {
//     notEmpty: true,
//     errorMessage: "Category name must not be empty",
//   },
// };
router.get("/users/:id/cart", (0, ErrorCatching_1.default)(payment_controller_1.default.getCart));
router.post("/users/:id/cart/items", (0, ErrorCatching_1.default)(payment_controller_1.default.addCart));
// router.patch("/:id", errorCatching(CategoryController.update));
router.delete("/users/:userId/cart/items/:courseId", (0, ErrorCatching_1.default)(payment_controller_1.default.removeFromCart));
router.post("/orders", (0, ErrorCatching_1.default)(payment_controller_1.default.createOrder));
router.get("/orders/:id", (0, ErrorCatching_1.default)(payment_controller_1.default.getOrder));
router.post("/checkout", (0, ErrorCatching_1.default)(payment_controller_1.default.confirmOrder));
router.get("/checkout", (0, ErrorCatching_1.default)(payment_controller_1.default.checkOut));
router.patch("/orders/:id", (0, ErrorCatching_1.default)(payment_controller_1.default.updateOrderStatus));
router.get("/mail/:orderId", (0, ErrorCatching_1.default)(payment_controller_1.default.sendMail));
// router.get("/:id", errorCatching(CategoryController.getDetail));
exports.default = router;
