import AppError from "../custom/AppError";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import Feedback from "./schema/feedback.schema";

export default class FeedbackService {
  static create = async (createFeedbackDto: CreateFeedbackDto) => {
    const { userId, courseId } = createFeedbackDto;

    let feedback = await Feedback.findOne({
      userId,
      courseId,
      isDeleted: false,
    }).exec();
    if (feedback)
      throw new AppError("Already provide feedback for this course", 403);

    let res = await Feedback.create({ ...createFeedbackDto });

    return {
      status: 201,
      message: "Create feedback successfully",
      data: res,
    };
  };

  static getFeedbacks = async () => {
    let res = await Feedback.find({ isDeleted: false }).select("+createdAt");

    return {
      status: 200,
      message: "Get feedbacks successfully",
      data: res,
    };
  };

  static update = async (
    feedbackId: string,
    updateFeedbackDto: UpdateFeedbackDto
  ) => {
    let feedback = await Feedback.findById(feedbackId).exec();
    if (!feedback) throw new AppError("Feedback does not exist", 400);

    let res = await Feedback.findByIdAndUpdate(feedbackId, {
      ...updateFeedbackDto,
    });

    return {
      status: 200,
      message: "Update feedback successfully",
      data: res,
    };
  };

  static delete = async (feedbackId: string) => {
    let feedback = await Feedback.findById(feedbackId).exec();
    if (!feedback) throw new AppError("Feedback does not exist", 400);

    let res = await Feedback.findByIdAndUpdate(feedbackId, { isDeleted: true });

    return {
      status: 200,
      message: "Delete feedback successfully",
      data: res,
    };
  };
}
