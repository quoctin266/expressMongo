"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const router = express_1.default.Router();
router.get("/", (0, ErrorCatching_1.default)(user_controller_1.default.getUsersList));
router.post("/", (0, ErrorCatching_1.default)(user_controller_1.default.create));
router.get("/:id", (0, ErrorCatching_1.default)(user_controller_1.default.getDetail));
router.patch("/:id", (0, ErrorCatching_1.default)(user_controller_1.default.update));
exports.default = router;
