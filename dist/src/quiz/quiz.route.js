"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const express_validator_1 = require("express-validator");
const error_validate_1 = require("../middleware/error.validate");
const quiz_controller_1 = __importDefault(require("./quiz.controller"));
const router = express_1.default.Router();
const validateCreateQuiz = {
    title: {
        notEmpty: true,
        errorMessage: "Quiz title must not be empty",
    },
    description: {
        notEmpty: true,
        errorMessage: "Quiz description must not be empty",
    },
};
// router.get("/", errorCatching(CategoryController.getList));
router.post("/courses/:courseId", (0, express_validator_1.checkSchema)(validateCreateQuiz), error_validate_1.validateError, (0, ErrorCatching_1.default)(quiz_controller_1.default.create));
router.get("/courses/:courseId", (0, ErrorCatching_1.default)(quiz_controller_1.default.getQuizes));
router.patch("/:quizId", (0, ErrorCatching_1.default)(quiz_controller_1.default.update));
router.delete("/:quizId", (0, ErrorCatching_1.default)(quiz_controller_1.default.delete));
exports.default = router;
