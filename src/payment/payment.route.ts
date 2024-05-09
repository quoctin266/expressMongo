import express from "express";
import errorCatching from "../custom/ErrorCatching";
import PaymentController from "./payment.controller";

const router = express.Router();

// const validateCreateCategory = {
//   name: {
//     notEmpty: true,
//     errorMessage: "Category name must not be empty",
//   },
// };

router.get("/users/:id/cart", errorCatching(PaymentController.getCart));

router.post("/users/:id/cart/items", errorCatching(PaymentController.addCart));

// router.patch("/:id", errorCatching(CategoryController.update));

router.delete(
  "/users/:userId/cart/items/:courseId",
  errorCatching(PaymentController.removeFromCart)
);

router.post("/orders", errorCatching(PaymentController.createOrder));

router.get("/orders/:id", errorCatching(PaymentController.getOrder));

router.post("/checkout", errorCatching(PaymentController.confirmOrder));

router.get("/checkout", errorCatching(PaymentController.checkOut));

router.get("/transaction", errorCatching(PaymentController.processTransaction));

router.patch("/orders/:id", errorCatching(PaymentController.updateOrderStatus));

router.get("/mail/:orderId", errorCatching(PaymentController.sendMail));

// router.get("/:id", errorCatching(CategoryController.getDetail));

export default router;
