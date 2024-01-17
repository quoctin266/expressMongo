import express from "express";
import errorCatching from "../custom/ErrorCatching";
import { checkSchema } from "express-validator";
import { validateError } from "../middleware/error.validate";
import QuestionController from "./question.controller";

const router = express.Router();

const validateCreateQuestion = {
  title: {
    notEmpty: true,
    errorMessage: "Question title must not be empty",
  },
  content: {
    notEmpty: true,
    errorMessage: "Question content must not be empty",
  },
  point: {
    notEmpty: true,
    errorMessage: "Question point must not be empty",
  },
};

// router.get("/", errorCatching(CategoryController.getList));

router.post(
  "/quizes/:quizId",
  checkSchema(validateCreateQuestion),
  validateError,
  errorCatching(QuestionController.create)
);

router.get("/quizes/:quizId", errorCatching(QuestionController.getQuestions));

router.patch("/:questionId", errorCatching(QuestionController.update));

router.delete("/:questionId", errorCatching(QuestionController.delete));

export default router;
