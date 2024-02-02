"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateError = void 0;
const express_validator_1 = require("express-validator");
const ValidationError_1 = __importDefault(require("../custom/ValidationError"));
const validateError = (req, res, next) => {
    const validateResult = (0, express_validator_1.validationResult)(req);
    if (!validateResult.isEmpty()) {
        const errorArray = validateResult.array().map((error) => {
            return {
                message: error.msg,
                field: error.path,
            };
        });
        throw new ValidationError_1.default("Validation fail", 400, errorArray);
    }
    next();
};
exports.validateError = validateError;
