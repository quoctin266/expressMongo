import express from "express";

import nationRoutes from "./src/SDN/nation/nation.route";
import playerRoutes from "./src/SDN/player/player.route";

import userRoutes from "./src/user/user.route";
import authRoutes from "./src/auth/auth.route";
import fileRoutes from "./src/file/file.route";
import categoryRoutes from "./src/category/category.route";
import courseRoutes from "./src/course/course.route";
import paymentRoutes from "./src/payment/payment.route";
import readingRoutes from "./src/reading/reading.route";
import videoRoutes from "./src/video/video.route";
import quizRoutes from "./src/quiz/quiz.route";
import questionRoutes from "./src/question/question.route";

import { checkUserJWT } from "./src/middleware/jwt.service";

const router = express.Router();

router.all("*", checkUserJWT);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/files", fileRoutes);
router.use("/categories", categoryRoutes);
router.use("/courses", courseRoutes);
router.use("/payment", paymentRoutes);
router.use("/readings", readingRoutes);
router.use("/videos", videoRoutes);
router.use("/quizes", quizRoutes);
router.use("/questions", questionRoutes);

router.use("/nations", nationRoutes);
router.use("/players", playerRoutes);

export default router;
