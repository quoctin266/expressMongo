"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorValidation extends Error {
    constructor(message, statusCode, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
}
exports.default = ErrorValidation;
