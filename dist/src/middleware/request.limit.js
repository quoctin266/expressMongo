"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLimitMiddleware = void 0;
const attempRecord_schema_1 = __importDefault(require("../quizAttempt/schema/attempRecord.schema"));
const AppError_1 = __importDefault(require("../custom/AppError"));
const requestLimitMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, quizId } = req.body;
    let record = yield attempRecord_schema_1.default.findOne({ userId, quizId }).exec();
    // Check if the user has exceeded the daily request limit
    if (record) {
        if (!record.count) {
            yield attempRecord_schema_1.default.findByIdAndUpdate(record.id, { count: 1 });
        }
        else if (record.count >= 3) {
            throw new AppError_1.default("Attempt limit exceeded", 429);
        }
        else {
            yield attempRecord_schema_1.default.findByIdAndUpdate(record.id, {
                count: record.count + 1,
            });
        }
    }
    else
        yield attempRecord_schema_1.default.create({ userId, quizId, count: 1 });
    next();
});
exports.requestLimitMiddleware = requestLimitMiddleware;
