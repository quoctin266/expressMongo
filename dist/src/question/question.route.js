"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const express_validator_1 = require("express-validator");
const error_validate_1 = require("../middleware/error.validate");
const question_controller_1 = __importDefault(require("./question.controller"));
const router = express_1.default.Router();
const validateCreateQuestion = {
    title: {
        notEmpty: true,
        errorMessage: "Question title must not be empty",
    },
    content: {
        notEmpty: true,
        errorMessage: "Question content must not be empty",
    },
    point: {
        notEmpty: true,
        errorMessage: "Question point must not be empty",
    },
};
// router.get("/", errorCatching(CategoryController.getList));
router.post("/quizes/:quizId", (0, express_validator_1.checkSchema)(validateCreateQuestion), error_validate_1.validateError, (0, ErrorCatching_1.default)(question_controller_1.default.create));
router.get("/quizes/:quizId", (0, ErrorCatching_1.default)(question_controller_1.default.getQuestions));
router.patch("/:questionId", (0, ErrorCatching_1.default)(question_controller_1.default.update));
router.delete("/:questionId", (0, ErrorCatching_1.default)(question_controller_1.default.delete));
exports.default = router;
