import express from "express";
import errorCatching from "../custom/ErrorCatching";
import { checkSchema } from "express-validator";
import { validateError } from "../middleware/error.validate";
import SectionController from "./section.controller";

const router = express.Router();

const validateCreateSection = {
  name: {
    notEmpty: true,
    errorMessage: "Section name must not be empty",
  },
  courseId: {
    notEmpty: true,
    errorMessage: "CourseId must not be empty",
  },
};

router.get("/:courseId", errorCatching(SectionController.getList));

router.post(
  "/",
  checkSchema(validateCreateSection),
  validateError,
  errorCatching(SectionController.create)
);

router.patch("/:id", errorCatching(SectionController.update));

router.delete("/:id", errorCatching(SectionController.delete));

// router.get("/:id", errorCatching(CategoryController.getDetail));

export default router;
