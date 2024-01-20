import express from "express";
import errorCatching from "../custom/ErrorCatching";
import { checkSchema } from "express-validator";
import { validateError } from "../middleware/error.validate";
import FeedbackController from "./feedback.controller";

const router = express.Router();

const validateCreateFeedback = {
  comment: {
    notEmpty: true,
    errorMessage: "Comment must not be empty",
  },
  rating: {
    notEmpty: true,
    errorMessage: "Rating must not be empty",
  },
  userId: {
    notEmpty: true,
    errorMessage: "UserId must not be empty",
  },
  courseId: {
    notEmpty: true,
    errorMessage: "courseId must not be empty",
  },
};

// router.get("/", errorCatching(CategoryController.getList));

router.post(
  "/",
  checkSchema(validateCreateFeedback),
  validateError,
  errorCatching(FeedbackController.create)
);

router.get("/", errorCatching(FeedbackController.getFeedbacks));

router.patch("/:feedbackId", errorCatching(FeedbackController.update));

router.delete("/:feedbackId", errorCatching(FeedbackController.delete));

export default router;
