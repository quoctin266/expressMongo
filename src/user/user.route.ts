import express from "express";
import UserController from "./user.controller";
import errorCatching from "../custom/ErrorCatching";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("users list");
});
router.post("/", errorCatching(UserController.create));

export default router;
