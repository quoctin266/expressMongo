"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ErrorCatching_1 = __importDefault(require("../../custom/ErrorCatching"));
const player_controller_1 = __importDefault(require("./player.controller"));
const error_validate_1 = require("../../middleware/error.validate");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const validateCreatePlayer = {
    name: {
        notEmpty: true,
        errorMessage: "Player's name must not be empty",
    },
    club: {
        notEmpty: true,
        errorMessage: "Player's club must not be empty",
    },
    info: {
        notEmpty: true,
        errorMessage: "Player's info must not be empty",
    },
    img: {
        notEmpty: true,
        errorMessage: "Player's image must not be empty",
    },
    goals: {
        notEmpty: {
            errorMessage: "Player's goals must not be empty",
        },
    },
    nation: {
        notEmpty: true,
        errorMessage: "Player's nation must not be empty",
    },
};
router.get("/", (0, ErrorCatching_1.default)(player_controller_1.default.getList));
router.get("/:id", (0, ErrorCatching_1.default)(player_controller_1.default.getDetail));
router.post("/", (0, express_validator_1.checkSchema)(validateCreatePlayer), error_validate_1.validateError, (0, ErrorCatching_1.default)(player_controller_1.default.create));
router.delete("/:id", (0, ErrorCatching_1.default)(player_controller_1.default.delete));
router.patch("/:id", (0, ErrorCatching_1.default)(player_controller_1.default.update));
exports.default = router;
