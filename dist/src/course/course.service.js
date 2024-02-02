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
const AppError_1 = __importDefault(require("../custom/AppError"));
const user_schema_1 = __importDefault(require("../user/schema/user.schema"));
const library_1 = require("../util/library");
const course_schema_1 = __importDefault(require("./schema/course.schema"));
const file_service_1 = __importDefault(require("../file/file.service"));
const order_schema_1 = __importDefault(require("../payment/schema/order.schema"));
class CourseService {
}
_a = CourseService;
CourseService.createNewCourse = (req, createCourseDto) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = createCourseDto;
    if (!req.files || Object.keys(req.files).length === 0) {
        throw new AppError_1.default("No files were uploaded", 400);
    }
    let course = yield course_schema_1.default.findOne({ title }).exec();
    if (course)
        throw new AppError_1.default("Course title already exist", 409);
    let res = yield file_service_1.default.uploadFile(req, req.files.file);
    let result = yield course_schema_1.default.create(Object.assign(Object.assign({}, createCourseDto), { image: res.data.fileName }));
    return {
        status: 201,
        message: "Create new course successfully",
        data: result,
    };
});
CourseService.updateCourse = (id, req, updateCourseDto) => __awaiter(void 0, void 0, void 0, function* () {
    const { title } = updateCourseDto;
    let course = yield course_schema_1.default.findOne({ title }).exec();
    if (course && course._id.toString() !== id)
        throw new AppError_1.default("Course title already exist", 409);
    let res = null;
    if (req.files && Object.keys(req.files).length !== 0) {
        res = yield file_service_1.default.uploadFile(req, req.files.file);
        yield file_service_1.default.removeFile(course === null || course === void 0 ? void 0 : course.image);
    }
    let updateResult = yield course_schema_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateCourseDto), { image: (res === null || res === void 0 ? void 0 : res.data.fileName) ? res.data.fileName : course === null || course === void 0 ? void 0 : course.image }));
    return {
        status: 200,
        message: "Update course successfully",
        data: updateResult,
    };
});
CourseService.deleteCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield course_schema_1.default.findById(id).exec();
    if (!course)
        throw new AppError_1.default("Course not found", 404);
    let result = yield course_schema_1.default.findByIdAndUpdate(id, { isDeleted: true });
    return {
        status: 200,
        message: "Delete course successfully",
        data: result,
    };
});
CourseService.getCourseList = (filter, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    let { searchQuery, sortBy, sortDescending } = filter, filterCourse = __rest(filter, ["searchQuery", "sortBy", "sortDescending"]);
    sortDescending = (0, library_1.parseBoolean)(sortDescending);
    const defaultLimit = limit ? limit : 10;
    const skip = ((page ? page : 1) - 1) * defaultLimit;
    const resultCount = (yield course_schema_1.default.find(Object.assign({ isDeleted: false, title: new RegExp(searchQuery, "i") }, filterCourse))).length;
    const totalPages = Math.ceil(resultCount / defaultLimit);
    let res = yield course_schema_1.default.find(Object.assign({ isDeleted: false, title: new RegExp(searchQuery, "i") }, filterCourse))
        .select("+createdAt")
        .skip(skip)
        .limit(defaultLimit)
        .sort(sortDescending ? `-${sortBy}` : `${sortBy}`);
    let courseList = res.map((course) => {
        const imageUrl = file_service_1.default.createFileLink(course.image);
        const _b = course.toObject(), { image } = _b, rest = __rest(_b, ["image"]);
        return Object.assign(Object.assign({}, rest), { imageUrl });
    });
    return {
        status: 200,
        message: "Get course list successfully",
        data: {
            pageIndex: page ? page : 1,
            pageSize: defaultLimit,
            totalPages,
            resultCount,
            items: courseList,
        },
    };
});
CourseService.getCourseDetail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield course_schema_1.default.findById(id).select("+createdAt");
    const imageUrl = file_service_1.default.createFileLink(course === null || course === void 0 ? void 0 : course.image);
    return {
        status: 200,
        message: "Get course detail successfully",
        data: Object.assign(Object.assign({}, course === null || course === void 0 ? void 0 : course.toObject()), { imageUrl }),
    };
});
CourseService.getCourseStudentList = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield course_schema_1.default.findById(courseId).populate("students");
    return {
        status: 200,
        message: "Get course's students list successfully",
        data: course === null || course === void 0 ? void 0 : course.students,
    };
});
CourseService.getUserCoursesList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_schema_1.default.findById(userId);
    let courseList = yield Promise.all((user === null || user === void 0 ? void 0 : user.purchasedCourses).map((courseId) => __awaiter(void 0, void 0, void 0, function* () {
        let course = yield course_schema_1.default.findById(courseId);
        const imageUrl = file_service_1.default.createFileLink(course === null || course === void 0 ? void 0 : course.image);
        let order = yield order_schema_1.default.findOne({ userId, courseId }).select("+createdAt");
        return Object.assign(Object.assign({}, course === null || course === void 0 ? void 0 : course.toObject()), { imageUrl, purchasedDate: order === null || order === void 0 ? void 0 : order.createdAt });
    })));
    return {
        status: 200,
        message: "Get user's courses list successfully",
        data: courseList,
    };
});
exports.default = CourseService;
