import express from "express";

import nationRoutes from "./src/SDN/nation/nation.route";
import playerRoutes from "./src/SDN/player/player.route";

import userRoutes from "./src/user/user.route";
import authRoutes from "./src/auth/auth.route";
import fileRoutes from "./src/file/file.route";
import categoryRoutes from "./src/category/category.route";
import courseRoutes from "./src/course/course.route";
import { checkUserJWT } from "./src/middleware/jwt.service";

const router = express.Router();

router.all("*", checkUserJWT);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/files", fileRoutes);
router.use("/categories", categoryRoutes);
router.use("/courses", courseRoutes);

router.use("/nations", nationRoutes);
router.use("/players", playerRoutes);

export default router;
