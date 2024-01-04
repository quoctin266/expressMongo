import express from "express";
import errorCatching from "../custom/ErrorCatching";
import AuthController from "./auth.controller";
import { checkSchema } from "express-validator";
import { validateError } from "../middleware/error.validate";

const router = express.Router();

const validateRegister = {
  username: { notEmpty: true, errorMessage: "Username must not be empty" },
  email: {
    notEmpty: {
      errorMessage: "Email must not be empty",
    },
    isEmail: {
      errorMessage: "Invalid email",
    },
  },
  password: { notEmpty: true, errorMessage: "Password must not be empty" },
};

const validateLogin = {
  email: {
    notEmpty: {
      errorMessage: "Email must not be empty",
    },
    isEmail: {
      errorMessage: "Invalid email",
    },
  },
  password: { notEmpty: true, errorMessage: "Password must not be empty" },
};

router.post(
  "/register",
  checkSchema(validateRegister),
  validateError,
  errorCatching(AuthController.register)
);

router.post(
  "/login",
  checkSchema(validateLogin),
  validateError,
  errorCatching(AuthController.login)
);

router.post("/logout", errorCatching(AuthController.logout));

export default router;
