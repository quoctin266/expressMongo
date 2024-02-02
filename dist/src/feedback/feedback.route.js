"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const express_validator_1 = require("express-validator");
const error_validate_1 = require("../middleware/error.validate");
const feedback_controller_1 = __importDefault(require("./feedback.controller"));
const router = express_1.default.Router();
const validateCreateFeedback = {
    comment: {
        notEmpty: true,
        errorMessage: "Comment must not be empty",
    },
    rating: {
        notEmpty: true,
        errorMessage: "Rating must not be empty",
    },
    userId: {
        notEmpty: true,
        errorMessage: "UserId must not be empty",
    },
    courseId: {
        notEmpty: true,
        errorMessage: "courseId must not be empty",
    },
};
// router.get("/", errorCatching(CategoryController.getList));
router.post("/", (0, express_validator_1.checkSchema)(validateCreateFeedback), error_validate_1.validateError, (0, ErrorCatching_1.default)(feedback_controller_1.default.create));
router.get("/", (0, ErrorCatching_1.default)(feedback_controller_1.default.getFeedbacks));
router.patch("/:feedbackId", (0, ErrorCatching_1.default)(feedback_controller_1.default.update));
router.delete("/:feedbackId", (0, ErrorCatching_1.default)(feedback_controller_1.default.delete));
exports.default = router;
