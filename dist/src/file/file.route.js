"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const file_controller_1 = __importDefault(require("./file.controller"));
const ErrorCatching_1 = __importDefault(require("../custom/ErrorCatching"));
const router = express_1.default.Router();
router.post("/", (0, ErrorCatching_1.default)(file_controller_1.default.upload));
router.delete("/", (0, ErrorCatching_1.default)(file_controller_1.default.delete));
exports.default = router;
