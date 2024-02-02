"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const express_validator_1 = require("express-validator");
const error_validate_1 = require("../middleware/error.validate");
const router = express_1.default.Router();
const validateRegister = {
    username: { notEmpty: true, errorMessage: "Username must not be empty" },
    email: {
        notEmpty: {
            errorMessage: "Email must not be empty",
        },
        isEmail: {
            errorMessage: "Invalid email",
        },
    },
    password: { notEmpty: true, errorMessage: "Password must not be empty" },
};
const validateLogin = {
    email: {
        notEmpty: {
            errorMessage: "Email must not be empty",
        },
        isEmail: {
            errorMessage: "Invalid email",
        },
    },
    password: { notEmpty: true, errorMessage: "Password must not be empty" },
};
router.post("/register", (0, express_validator_1.checkSchema)(validateRegister), error_validate_1.validateError, (0, ErrorCatching_1.default)(auth_controller_1.default.register));
router.post("/login", (0, express_validator_1.checkSchema)(validateLogin), error_validate_1.validateError, (0, ErrorCatching_1.default)(auth_controller_1.default.login));
router.post("/google-login", (0, ErrorCatching_1.default)(auth_controller_1.default.googleAuth));
router.post("/logout", (0, ErrorCatching_1.default)(auth_controller_1.default.logout));
router.post("/refresh", (0, ErrorCatching_1.default)(auth_controller_1.default.getNewToken));
router.post("/verify-password", (0, ErrorCatching_1.default)(auth_controller_1.default.verifyPW));
router.post("/reset-password", (0, ErrorCatching_1.default)(auth_controller_1.default.changePW));
router.post("/check-otp/:userId", (0, ErrorCatching_1.default)(auth_controller_1.default.checkOtp));
router.get("/resend-otp/:userId", (0, ErrorCatching_1.default)(auth_controller_1.default.resendOtp));
router.post("/forget-password", (0, ErrorCatching_1.default)(auth_controller_1.default.forgetPassword));
router.get("/verify-request", (0, ErrorCatching_1.default)(auth_controller_1.default.verifyRequest));
exports.default = router;
