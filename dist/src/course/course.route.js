"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const course_controller_1 = __importDefault(require("./course.controller"));
const express_validator_1 = require("express-validator");
const error_validate_1 = require("../middleware/error.validate");
const router = express_1.default.Router();
const validateCreateCourse = {
    title: {
        notEmpty: true,
        errorMessage: "Course title must not be empty",
    },
    body: {
        notEmpty: true,
        errorMessage: "Course body must not be empty",
    },
    price: {
        notEmpty: true,
        errorMessage: "Course price must not be empty",
    },
    categoryId: {
        notEmpty: true,
        errorMessage: "Category must not be empty",
    },
};
router.get("/", (0, ErrorCatching_1.default)(course_controller_1.default.getcoursesList));
router.post("/", (0, express_validator_1.checkSchema)(validateCreateCourse), error_validate_1.validateError, (0, ErrorCatching_1.default)(course_controller_1.default.create));
router.get("/:id", (0, ErrorCatching_1.default)(course_controller_1.default.getDetail));
router.get("/students/:courseId", (0, ErrorCatching_1.default)(course_controller_1.default.getCourseStudents));
router.get("/users/:userId", (0, ErrorCatching_1.default)(course_controller_1.default.getUserCoursesList));
router.patch("/:id", (0, ErrorCatching_1.default)(course_controller_1.default.update));
router.delete("/:id", (0, ErrorCatching_1.default)(course_controller_1.default.delete));
exports.default = router;
