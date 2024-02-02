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
const file_service_1 = __importDefault(require("../file/file.service"));
const video_schema_1 = __importDefault(require("./schema/video.schema"));
const course_schema_1 = __importDefault(require("../course/schema/course.schema"));
class VideoService {
}
_a = VideoService;
VideoService.create = (req, createVideoDto, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length === 0) {
        throw new AppError_1.default("No files were uploaded", 400);
    }
    let res = yield file_service_1.default.uploadFile(req, req.files.file);
    let createRes = yield video_schema_1.default.create(Object.assign(Object.assign({}, createVideoDto), { fileName: res.data.fileName, courseId }));
    return {
        status: 201,
        message: "Create video successfully",
        data: createRes,
    };
});
VideoService.getCourseVideos = (courseId) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield course_schema_1.default.findById(courseId).exec();
    if (!course)
        throw new AppError_1.default("Course not found", 400);
    let result = yield video_schema_1.default.find({ courseId, isDeleted: false });
    let videoList = result.map((video) => {
        const videoUrl = file_service_1.default.createFileLink(video.fileName);
        const _b = video.toObject(), { fileName } = _b, rest = __rest(_b, ["fileName"]);
        return Object.assign(Object.assign({}, rest), { videoUrl });
    });
    return {
        status: 200,
        message: "Get course's videos successfully",
        data: videoList,
    };
});
VideoService.updateInfo = (videoId, updateVideoDto) => __awaiter(void 0, void 0, void 0, function* () {
    let video = yield video_schema_1.default.findById(videoId).exec();
    if (!video)
        throw new AppError_1.default("Video does not exist", 400);
    let res = yield video_schema_1.default.findByIdAndUpdate(videoId, Object.assign({}, updateVideoDto));
    return {
        status: 200,
        message: "Update video info successfully",
        data: res,
    };
});
VideoService.updateFile = (req, videoId) => __awaiter(void 0, void 0, void 0, function* () {
    let video = yield video_schema_1.default.findById(videoId).exec();
    if (!video)
        throw new AppError_1.default("Video does not exist", 400);
    if (!req.files || Object.keys(req.files).length === 0) {
        throw new AppError_1.default("No files were uploaded", 400);
    }
    let res = yield file_service_1.default.uploadFile(req, req.files.file);
    yield file_service_1.default.removeFile(video.fileName);
    yield video_schema_1.default.findByIdAndUpdate(videoId, { fileName: res.data.fileName });
    return {
        status: 200,
        message: "Update video file successfully",
        data: null,
    };
});
VideoService.delete = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    let video = yield video_schema_1.default.findById(videoId).exec();
    if (!video)
        throw new AppError_1.default("Video does not exist", 400);
    let res = yield video_schema_1.default.findByIdAndUpdate(videoId, { isDeleted: true });
    return {
        status: 200,
        message: "Delete video successfully",
        data: res,
    };
});
exports.default = VideoService;
