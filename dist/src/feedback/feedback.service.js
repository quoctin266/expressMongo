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
const AppError_1 = __importDefault(require("../custom/AppError"));
const feedback_schema_1 = __importDefault(require("./schema/feedback.schema"));
class FeedbackService {
}
_a = FeedbackService;
FeedbackService.create = (createFeedbackDto) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId } = createFeedbackDto;
    let feedback = yield feedback_schema_1.default.findOne({
        userId,
        courseId,
        isDeleted: false,
    }).exec();
    if (feedback)
        throw new AppError_1.default("Already provide feedback for this course", 403);
    let res = yield feedback_schema_1.default.create(Object.assign({}, createFeedbackDto));
    return {
        status: 201,
        message: "Create feedback successfully",
        data: res,
    };
});
FeedbackService.getFeedbacks = () => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield feedback_schema_1.default.find({ isDeleted: false }).select("+createdAt");
    return {
        status: 200,
        message: "Get feedbacks successfully",
        data: res,
    };
});
FeedbackService.update = (feedbackId, updateFeedbackDto) => __awaiter(void 0, void 0, void 0, function* () {
    let feedback = yield feedback_schema_1.default.findById(feedbackId).exec();
    if (!feedback)
        throw new AppError_1.default("Feedback does not exist", 400);
    let res = yield feedback_schema_1.default.findByIdAndUpdate(feedbackId, Object.assign({}, updateFeedbackDto));
    return {
        status: 200,
        message: "Update feedback successfully",
        data: res,
    };
});
FeedbackService.delete = (feedbackId) => __awaiter(void 0, void 0, void 0, function* () {
    let feedback = yield feedback_schema_1.default.findById(feedbackId).exec();
    if (!feedback)
        throw new AppError_1.default("Feedback does not exist", 400);
    let res = yield feedback_schema_1.default.findByIdAndUpdate(feedbackId, { isDeleted: true });
    return {
        status: 200,
        message: "Delete feedback successfully",
        data: res,
    };
});
exports.default = FeedbackService;
