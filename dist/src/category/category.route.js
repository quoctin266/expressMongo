"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const category_controller_1 = __importDefault(require("./category.controller"));
const express_validator_1 = require("express-validator");
const error_validate_1 = require("../middleware/error.validate");
const router = express_1.default.Router();
const validateCreateCategory = {
    name: {
        notEmpty: true,
        errorMessage: "Category name must not be empty",
    },
};
router.get("/", (0, ErrorCatching_1.default)(category_controller_1.default.getList));
router.post("/", (0, express_validator_1.checkSchema)(validateCreateCategory), error_validate_1.validateError, (0, ErrorCatching_1.default)(category_controller_1.default.create));
router.patch("/:id", (0, ErrorCatching_1.default)(category_controller_1.default.update));
router.delete("/:id", (0, ErrorCatching_1.default)(category_controller_1.default.delete));
router.get("/:id", (0, ErrorCatching_1.default)(category_controller_1.default.getDetail));
exports.default = router;
