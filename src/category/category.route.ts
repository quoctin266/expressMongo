import express from "express";
import errorCatching from "../custom/ErrorCatching";
import CategoryController from "./category.controller";
import { checkSchema } from "express-validator";
import { validateError } from "../middleware/error.validate";

const router = express.Router();

const validateCreateCategory = {
  name: {
    notEmpty: true,
    errorMessage: "Category name must not be empty",
  },
};

router.get("/", errorCatching(CategoryController.getList));

router.post(
  "/",
  checkSchema(validateCreateCategory),
  validateError,
  errorCatching(CategoryController.create)
);

router.patch("/:id", errorCatching(CategoryController.update));

router.delete("/:id", errorCatching(CategoryController.delete));

router.get("/:id", errorCatching(CategoryController.getDetail));

export default router;
