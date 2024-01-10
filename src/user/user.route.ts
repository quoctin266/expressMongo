import express from "express";
import UserController from "./user.controller";
import errorCatching from "../custom/ErrorCatching";

const router = express.Router();

router.get("/", errorCatching(UserController.getUsersList));

router.post("/", errorCatching(UserController.create));

router.get("/:id", errorCatching(UserController.getDetail));

router.patch("/:id", errorCatching(UserController.update));

export default router;
