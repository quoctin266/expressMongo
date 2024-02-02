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
const section_schema_1 = __importDefault(require("./schema/section.schema"));
class SectionService {
}
_a = SectionService;
SectionService.create = (createSectionDto) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = createSectionDto;
    let course = yield course_schema_1.default.findById(courseId).exec();
    if (!course)
        throw new AppError_1.default("Course does not exist", 400);
    let res = yield section_schema_1.default.create(Object.assign({}, createSectionDto));
    return {
        status: 201,
        message: "Create new section successfully",
        data: res,
    };
});
SectionService.getCourseSections = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield course_schema_1.default.findById(courseId).exec();
    if (!course)
        throw new AppError_1.default("Course not found", 400);
    let res = yield section_schema_1.default.find({ courseId, isDeleted: false });
    return {
        status: 200,
        message: "Get course's sections successfully",
        data: res,
    };
});
exports.default = SectionService;
