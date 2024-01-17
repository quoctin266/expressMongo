import express from "express";
import errorCatching from "../custom/ErrorCatching";
import { checkSchema } from "express-validator";
import { validateError } from "../middleware/error.validate";
import QuizController from "./quiz.controller";

const router = express.Router();

const validateCreateQuiz = {
  title: {
    notEmpty: true,
    errorMessage: "Quiz title must not be empty",
  },
  description: {
    notEmpty: true,
    errorMessage: "Quiz description must not be empty",
  },
};

// router.get("/", errorCatching(CategoryController.getList));

router.post(
  "/courses/:courseId",
  checkSchema(validateCreateQuiz),
  validateError,
  errorCatching(QuizController.create)
);

router.get("/courses/:courseId", errorCatching(QuizController.getQuizes));

router.patch("/:quizId", errorCatching(QuizController.update));

router.delete("/:quizId", errorCatching(QuizController.delete));

export default router;
