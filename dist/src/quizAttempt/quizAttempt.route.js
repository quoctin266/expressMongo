"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const express_validator_1 = require("express-validator");
const error_validate_1 = require("../middleware/error.validate");
const quizAttempt_controller_1 = __importDefault(require("./quizAttempt.controller"));
const request_limit_1 = require("../middleware/request.limit");
const node_cron_1 = __importDefault(require("node-cron"));
const attempRecord_schema_1 = __importDefault(require("./schema/attempRecord.schema"));
const router = express_1.default.Router();
const validateCreateAttempt = {
    quizId: {
        notEmpty: true,
        errorMessage: "Quiz id must not be empty",
    },
    userId: {
        notEmpty: true,
        errorMessage: "User id must not be empty",
    },
};
// router.get("/", errorCatching(CategoryController.getList));
router.post("/quizes", (0, express_validator_1.checkSchema)(validateCreateAttempt), error_validate_1.validateError, (0, ErrorCatching_1.default)(request_limit_1.requestLimitMiddleware), (0, ErrorCatching_1.default)(quizAttempt_controller_1.default.create));
// router.get("/quizes/:quizId", errorCatching(QuestionController.getQuestions));
// router.patch("/:questionId", errorCatching(QuestionController.update));
// router.delete("/:questionId", errorCatching(QuestionController.delete));
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    // Reset requestCounts
    yield attempRecord_schema_1.default.updateMany({}, { count: 0 });
}), {
    timezone: "Asia/Ho_Chi_Minh",
});
exports.default = router;
