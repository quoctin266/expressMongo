import express from "express";
import NationController from "./nation.controller";
import errorCatching from "../../custom/ErrorCatching";
import { checkSchema } from "express-validator";
import { validateError } from "../../middleware/error.validate";

const router = express.Router();

const validateCreateNation = {
  name: {
    notEmpty: true,
    errorMessage: "Nation name must not be empty",
  },
  description: {
    notEmpty: true,
    errorMessage: "Nation description must not be empty",
  },
};

router.get("/", errorCatching(NationController.getList));

router.get("/:id", errorCatching(NationController.getNation));

router.post(
  "/",
  checkSchema(validateCreateNation),
  validateError,
  errorCatching(NationController.create)
);

router.patch("/:id", errorCatching(NationController.update));

router.delete("/:id", errorCatching(NationController.delete));

export default router;
