"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nation_route_1 = __importDefault(require("./src/SDN/nation/nation.route"));
const player_route_1 = __importDefault(require("./src/SDN/player/player.route"));
const user_route_1 = __importDefault(require("./src/user/user.route"));
const auth_route_1 = __importDefault(require("./src/auth/auth.route"));
const file_route_1 = __importDefault(require("./src/file/file.route"));
const category_route_1 = __importDefault(require("./src/category/category.route"));
const course_route_1 = __importDefault(require("./src/course/course.route"));
const payment_route_1 = __importDefault(require("./src/payment/payment.route"));
const reading_route_1 = __importDefault(require("./src/reading/reading.route"));
const video_route_1 = __importDefault(require("./src/video/video.route"));
const quiz_route_1 = __importDefault(require("./src/quiz/quiz.route"));
const question_route_1 = __importDefault(require("./src/question/question.route"));
const quizAttempt_route_1 = __importDefault(require("./src/quizAttempt/quizAttempt.route"));
const feedback_route_1 = __importDefault(require("./src/feedback/feedback.route"));
const section_route_1 = __importDefault(require("./src/section/section.route"));
const jwt_service_1 = require("./src/middleware/jwt.service");
const router = express_1.default.Router();
router.all("*", jwt_service_1.checkUserJWT);
router.use("/users", user_route_1.default);
router.use("/auth", auth_route_1.default);
router.use("/files", file_route_1.default);
router.use("/categories", category_route_1.default);
router.use("/courses", course_route_1.default);
router.use("/payment", payment_route_1.default);
router.use("/readings", reading_route_1.default);
router.use("/videos", video_route_1.default);
router.use("/quizes", quiz_route_1.default);
router.use("/questions", question_route_1.default);
router.use("/attempts", quizAttempt_route_1.default);
router.use("/feedbacks", feedback_route_1.default);
router.use("/sections", section_route_1.default);
router.use("/nations", nation_route_1.default);
router.use("/players", player_route_1.default);
exports.default = router;