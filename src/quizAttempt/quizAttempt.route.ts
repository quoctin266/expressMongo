import express from "express";
import errorCatching from "../custom/ErrorCatching";
import { checkSchema } from "express-validator";
import { validateError } from "../middleware/error.validate";
import QuizAttemptController from "./quizAttempt.controller";
import { requestLimitMiddleware } from "../middleware/request.limit";
import cron from "node-cron";
import AttemptRecord from "./schema/attempRecord.schema";

const router = express.Router();

const validateCreateAttempt = {
  quizId: {
    notEmpty: true,
    errorMessage: "Quiz id must not be empty",
  },
  userId: {
    notEmpty: true,
    errorMessage: "User id must not be empty",
  },
};

// router.get("/", errorCatching(CategoryController.getList));

router.post(
  "/quizes",
  checkSchema(validateCreateAttempt),
  validateError,
  errorCatching(requestLimitMiddleware),
  errorCatching(QuizAttemptController.create)
);

// router.get("/quizes/:quizId", errorCatching(QuestionController.getQuestions));

// router.patch("/:questionId", errorCatching(QuestionController.update));

// router.delete("/:questionId", errorCatching(QuestionController.delete));

cron.schedule(
  "0 0 * * *",
  async () => {
    // Reset requestCounts
    await AttemptRecord.updateMany({}, { count: 0 });
  },
  {
    timezone: "Asia/Ho_Chi_Minh",
  }
);

export default router;
