"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const express_validator_1 = require("express-validator");
const error_validate_1 = require("../middleware/error.validate");
const section_controller_1 = __importDefault(require("./section.controller"));
const router = express_1.default.Router();
const validateCreateSection = {
    name: {
        notEmpty: true,
        errorMessage: "Section name must not be empty",
    },
    courseId: {
        notEmpty: true,
        errorMessage: "CourseId must not be empty",
    },
};
router.get("/:courseId", (0, ErrorCatching_1.default)(section_controller_1.default.getList));
router.post("/", (0, express_validator_1.checkSchema)(validateCreateSection), error_validate_1.validateError, (0, ErrorCatching_1.default)(section_controller_1.default.create));
// router.patch("/:id", errorCatching(CategoryController.update));
// router.delete("/:id", errorCatching(CategoryController.delete));
// router.get("/:id", errorCatching(CategoryController.getDetail));
exports.default = router;
