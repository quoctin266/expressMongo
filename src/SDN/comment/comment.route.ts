import express from "express";
import errorCatching from "../../custom/ErrorCatching";
import { checkSchema } from "express-validator";
import { validateError } from "../../middleware/error.validate";
import CommentController from "./comment.controller";

const router = express.Router();

const validateCreateComment = {
  comment: {
    notEmpty: true,
    errorMessage: "Comment must not be empty",
  },
  rating: {
    notEmpty: true,
    errorMessage: "Rating must not be empty",
  },
  author: {
    notEmpty: true,
    errorMessage: "Author must not be empty",
  },
  player: {
    notEmpty: true,
    errorMessage: "Player must not be empty",
  },
};

router.get("/", errorCatching(CommentController.getList));

// router.get("/:id", errorCatching(NationController.getNation));

router.post(
  "/",
  checkSchema(validateCreateComment),
  validateError,
  errorCatching(CommentController.create)
);

router.patch("/:id", errorCatching(CommentController.update));

router.delete("/:id", errorCatching(CommentController.delete));

export default router;
