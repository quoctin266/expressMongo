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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../custom/AppError"));
const quiz_schema_1 = __importDefault(require("../quiz/schema/quiz.schema"));
const question_schema_1 = __importDefault(require("./schema/question.schema"));
const file_service_1 = __importDefault(require("../file/file.service"));
class QuestionService {
}
_a = QuestionService;
QuestionService.create = (quizId, req, createQuestionDto) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    let quiz = yield quiz_schema_1.default.findById(quizId).exec();
    if (!quiz)
        throw new AppError_1.default("Quiz not found", 400);
    if (((_b = createQuestionDto.answers) === null || _b === void 0 ? void 0 : _b.length) === 0 ||
        ((_c = createQuestionDto.correctAnswers) === null || _c === void 0 ? void 0 : _c.length) === 0)
        throw new AppError_1.default("Invalid or missing answers", 400);
    let uploadRes = null;
    if (req.files && Object.keys(req.files).length !== 0) {
        uploadRes = yield file_service_1.default.uploadFile(req, req.files.file);
    }
    const { answers, correctAnswers } = createQuestionDto, createData = __rest(createQuestionDto, ["answers", "correctAnswers"]);
    let answersData = JSON.parse(answers).map((item) => {
        return {
            content: item,
        };
    });
    let correctAnswersData = JSON.parse(correctAnswers).map((item) => {
        return {
            content: item,
        };
    });
    let res = yield question_schema_1.default.create(Object.assign(Object.assign({}, createData), { image: uploadRes === null || uploadRes === void 0 ? void 0 : uploadRes.data.fileName, quizId, answers: answersData, correctAnswers: correctAnswersData }));
    return {
        status: 201,
        message: "Create question successfully",
        data: res,
    };
});
QuestionService.getQuizQuestions = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
    let quiz = yield quiz_schema_1.default.findById(quizId).exec();
    if (!quiz)
        throw new AppError_1.default("Quiz not found", 400);
    let res = yield question_schema_1.default.find({ quizId, isDeleted: false });
    let questionList = res.map((question) => {
        const _b = question.toObject(), { answers, correctAnswers } = _b, questionInfo = __rest(_b, ["answers", "correctAnswers"]);
        const answerIds = answers.map((answer) => answer._id);
        const answersArr = answers.map((answer) => answer.content);
        const correctAnswersArr = correctAnswers.map((answer) => answer.content);
        let imageUrl = null;
        if (question.image) {
            imageUrl = file_service_1.default.createFileLink(question.image);
        }
        return Object.assign({ answers: answersArr, correctAnswers: correctAnswersArr, answerIds,
            imageUrl }, questionInfo);
    });
    return {
        status: 200,
        message: "Get quiz's questions successfully",
        data: questionList,
    };
});
QuestionService.update = (questionId, req, updateQuestionDto) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    let question = yield question_schema_1.default.findById(questionId).exec();
    if (!question)
        throw new AppError_1.default("Question not found", 400);
    if (((_d = updateQuestionDto.answers) === null || _d === void 0 ? void 0 : _d.length) === 0 ||
        ((_e = updateQuestionDto.correctAnswers) === null || _e === void 0 ? void 0 : _e.length) === 0)
        throw new AppError_1.default("Invalid or missing answers", 400);
    let uploadRes = null;
    if (req.files && Object.keys(req.files).length !== 0) {
        uploadRes = yield file_service_1.default.uploadFile(req, req.files.file);
        yield file_service_1.default.removeFile(question.image);
    }
    const { answers, correctAnswers } = updateQuestionDto, updateData = __rest(updateQuestionDto, ["answers", "correctAnswers"]);
    let answersData = JSON.parse(answers).map((item) => {
        return {
            id: new mongoose_1.default.Types.ObjectId(),
            content: item,
        };
    });
    let correctAnswersData = JSON.parse(correctAnswers).map((item) => {
        return {
            id: new mongoose_1.default.Types.ObjectId(),
            content: item,
        };
    });
    let res = yield question_schema_1.default.findByIdAndUpdate(questionId, Object.assign(Object.assign({}, updateData), { image: uploadRes === null || uploadRes === void 0 ? void 0 : uploadRes.data.fileName, answers: answersData, correctAnswers: correctAnswersData }));
    return {
        status: 200,
        message: "Update question successfully",
        data: res,
    };
});
QuestionService.delete = (questionId) => __awaiter(void 0, void 0, void 0, function* () {
    let question = yield question_schema_1.default.findById(questionId).exec();
    if (!question)
        throw new AppError_1.default("Question does not exist", 400);
    let res = yield question_schema_1.default.findByIdAndUpdate(questionId, { isDeleted: true });
    return {
        status: 200,
        message: "Delete question successfully",
        data: res,
    };
});
exports.default = QuestionService;
