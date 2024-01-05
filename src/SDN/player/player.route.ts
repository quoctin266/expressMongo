import express from "express";
import errorCatching from "../../custom/ErrorCatching";
import PlayerController from "./player.controller";
import { validateError } from "../../middleware/error.validate";
import { checkSchema } from "express-validator";
import { isNumber } from "class-validator";

const router = express.Router();

const validateCreatePlayer = {
  name: {
    notEmpty: true,
    errorMessage: "Player's name must not be empty",
  },
  club: {
    notEmpty: true,
    errorMessage: "Player's club must not be empty",
  },
  info: {
    notEmpty: true,
    errorMessage: "Player's info must not be empty",
  },
  img: {
    notEmpty: true,
    errorMessage: "Player's image must not be empty",
  },
  goals: {
    notEmpty: {
      errorMessage: "Player's goals must not be empty",
    },
  },
  nation: {
    notEmpty: true,
    errorMessage: "Player's nation must not be empty",
  },
};

router.get("/", errorCatching(PlayerController.getList));

router.get("/:id", errorCatching(PlayerController.getDetail));

router.post(
  "/",
  checkSchema(validateCreatePlayer),
  validateError,
  errorCatching(PlayerController.create)
);

router.delete("/:id", errorCatching(PlayerController.delete));

router.patch("/:id", errorCatching(PlayerController.update));

export default router;
