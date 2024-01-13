import express from "express";
import errorCatching from "../custom/ErrorCatching";
import { checkSchema } from "express-validator";
import { validateError } from "../middleware/error.validate";
import ReadingController from "./reading.controller";

const router = express.Router();

const validateCreateReading = {
  title: {
    notEmpty: true,
    errorMessage: "Reading title must not be empty",
  },
  body: {
    notEmpty: true,
    errorMessage: "Reading body must not be empty",
  },
  description: {
    notEmpty: true,
    errorMessage: "Reading description must not be empty",
  },
};

// router.get("/", errorCatching(CategoryController.getList));

router.post(
  "/courses/:courseId",
  checkSchema(validateCreateReading),
  validateError,
  errorCatching(ReadingController.create)
);

router.get("/courses/:courseId", errorCatching(ReadingController.getReadings));

router.patch("/:readingId", errorCatching(ReadingController.update));

router.delete("/:readingId", errorCatching(ReadingController.delete));

export default router;
