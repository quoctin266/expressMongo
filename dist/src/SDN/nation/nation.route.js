"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nation_controller_1 = __importDefault(require("./nation.controller"));
const ErrorCatching_1 = __importDefault(require("../../custom/ErrorCatching"));
const express_validator_1 = require("express-validator");
const error_validate_1 = require("../../middleware/error.validate");
const router = express_1.default.Router();
const validateCreateNation = {
    name: {
        notEmpty: true,
        errorMessage: "Nation name must not be empty",
    },
    description: {
        notEmpty: true,
        errorMessage: "Nation description must not be empty",
    },
};
router.get("/", (0, ErrorCatching_1.default)(nation_controller_1.default.getList));
router.get("/:id", (0, ErrorCatching_1.default)(nation_controller_1.default.getNation));
router.post("/", (0, express_validator_1.checkSchema)(validateCreateNation), error_validate_1.validateError, (0, ErrorCatching_1.default)(nation_controller_1.default.create));
router.patch("/:id", (0, ErrorCatching_1.default)(nation_controller_1.default.update));
router.delete("/:id", (0, ErrorCatching_1.default)(nation_controller_1.default.delete));
exports.default = router;
