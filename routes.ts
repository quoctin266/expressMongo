import express from "express";
import userRoutes from "./src/user/user.route";

const router = express.Router();

router.use("/user", userRoutes);

export default router;
