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
const course_schema_1 = __importDefault(require("../course/schema/course.schema"));
const AppError_1 = __importDefault(require("../custom/AppError"));
const quiz_schema_1 = __importDefault(require("./schema/quiz.schema"));
class QuizService {
}
_a = QuizService;
QuizService.create = (courseId, createQuizDto) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield course_schema_1.default.findById(courseId).exec();
    if (!course)
        throw new AppError_1.default("Course not found", 400);
    let res = yield quiz_schema_1.default.create(Object.assign(Object.assign({}, createQuizDto), { courseId }));
    return {
        status: 201,
        message: "Create quiz successfully",
        data: res,
    };
});
QuizService.getCoursequizes = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield course_schema_1.default.findById(courseId).exec();
    if (!course)
        throw new AppError_1.default("Course not found", 400);
    let res = yield quiz_schema_1.default.find({ courseId, isDeleted: false });
    return {
        status: 200,
        message: "Get course's quizes successfully",
        data: res,
    };
});
QuizService.update = (quizId, updateQuizDto) => __awaiter(void 0, void 0, void 0, function* () {
    let quiz = yield quiz_schema_1.default.findById(quizId).exec();
    if (!quiz)
        throw new AppError_1.default("Quiz does not exist", 400);
    let res = yield quiz_schema_1.default.findByIdAndUpdate(quizId, Object.assign({}, updateQuizDto));
    return {
        status: 200,
        message: "Update quiz successfully",
        data: res,
    };
});
QuizService.delete = (quizId) => __awaiter(void 0, void 0, void 0, function* () {
    let quiz = yield quiz_schema_1.default.findById(quizId).exec();
    if (!quiz)
        throw new AppError_1.default("Quiz does not exist", 400);
    let res = yield quiz_schema_1.default.findByIdAndUpdate(quizId, { isDeleted: true });
    return {
        status: 200,
        message: "Delete quiz successfully",
        data: res,
    };
});
exports.default = QuizService;