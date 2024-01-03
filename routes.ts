import express from "express";
import userRoutes from "./src/user/user.route";
import authRoutes from "./src/auth/auth.route";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);

export default router;
