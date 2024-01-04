import express from "express";
import UserController from "./user.controller";
import errorCatching from "../custom/ErrorCatching";
import { checkUserJWT } from "../middleware/jwt.service";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("users list");
});
router.post("/", errorCatching(UserController.create));

export default router;
