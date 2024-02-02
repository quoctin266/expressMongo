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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const question_schema_1 = __importDefault(require("../question/schema/question.schema"));
const library_1 = require("../util/library");
const quizAttempt_schema_1 = __importDefault(require("./schema/quizAttempt.schema"));
class QuizAttemptService {
}
_a = QuizAttemptService;
QuizAttemptService.create = (createQuizAttemptDto) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId, questions, userId } = createQuizAttemptDto;
    let quizQuestions = yield question_schema_1.default.find({ quizId });
    let isPassed = false;
    let correctQuestion = [];
    let totalPoint = 0;
    let userPoint = 0;
    quizQuestions.forEach((question) => {
        totalPoint += question.point;
        questions.forEach((result) => {
            if (question.id === result.questionId) {
                let correctAnswers = question.correctAnswers.map((answer) => answer.content);
                let userAnswers = [];
                result.userAnswers.forEach((answer) => {
                    question.answers.forEach((item) => {
                        if (item.id === answer)
                            userAnswers.push(item.content);
                    });
                });
                if ((0, library_1.hasSameElements)(correctAnswers, userAnswers))
                    correctQuestion.push(question);
            }
        });
    });
    correctQuestion.forEach((question) => {
        userPoint += question.point;
    });
    let point = (userPoint / totalPoint) * 100;
    if (point > 80)
        isPassed = true;
    let res = yield quizAttempt_schema_1.default.create({ userId, quizId, isPassed, point });
    return {
        status: 201,
        message: "Submit quiz successfully",
        data: res,
    };
});
exports.default = QuizAttemptService;
