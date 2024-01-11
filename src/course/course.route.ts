import express from "express";
import errorCatching from "../custom/ErrorCatching";
import CourseController from "./course.controller";
import { checkSchema } from "express-validator";
import { validateError } from "../middleware/error.validate";

const router = express.Router();

const validateCreateCourse = {
  title: {
    notEmpty: true,
    errorMessage: "Course title must not be empty",
  },
  body: {
    notEmpty: true,
    errorMessage: "Course body must not be empty",
  },
  price: {
    notEmpty: true,
    errorMessage: "Course price must not be empty",
  },
  categoryId: {
    notEmpty: true,
    errorMessage: "Category must not be empty",
  },
};

router.get("/", errorCatching(CourseController.getcoursesList));

router.post(
  "/",
  checkSchema(validateCreateCourse),
  validateError,
  errorCatching(CourseController.create)
);

// router.get("/:id", errorCatching(UserController.getDetail));

// router.patch("/:id", errorCatching(UserController.update));

export default router;