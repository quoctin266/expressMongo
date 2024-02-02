"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./AppError"));
const mongoose_1 = require("mongoose");
const ValidationError_1 = __importDefault(require("./ValidationError"));
const errorHandler = (error, req, res, next) => {
    if (error instanceof AppError_1.default) {
        return res.status(error.statusCode).json({
            status: error.statusCode,
            error: error.message,
            data: null,
        });
    }
    else if (error instanceof mongoose_1.MongooseError) {
        return res.status(400).json({
            status: 400,
            error: error.message,
            data: null,
        });
    }
    else if (error instanceof ValidationError_1.default) {
        return res.status(400).json({
            status: 400,
            message: error.message,
            error: error.errors,
        });
    }
    else {
        console.log(">>> Error", error.message);
        return res.status(500).json({
            status: 500,
            error: "Internal Server Error",
            data: null,
        });
    }
};
exports.default = errorHandler;
