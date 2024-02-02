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
const question_service_1 = __importDefault(require("./question.service"));
class QuestionController {
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { quizId } = req.params;
            let result = yield question_service_1.default.create(quizId, req, req.body);
            res.status(result.status).json(result);
        });
    }
    static getQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { quizId } = req.params;
            let result = yield question_service_1.default.getQuizQuestions(quizId);
            res.status(result.status).json(result);
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { questionId } = req.params;
            let result = yield question_service_1.default.update(questionId, req, req.body);
            res.status(result.status).json(result);
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { questionId } = req.params;
            let result = yield question_service_1.default.delete(questionId);
            res.status(result.status).json(result);
        });
    }
}
exports.default = QuestionController;
