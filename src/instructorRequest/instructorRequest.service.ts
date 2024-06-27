import moment from "moment";
import Category from "../category/schema/category.schema";
import Course from "../course/schema/course.schema";
import QuizService from "../quiz/quiz.service";
import ReadingService from "../reading/reading.service";
import SectionService from "../section/section.service";
import User from "../user/schema/user.schema";
import { parseBoolean } from "../util/library";
import VideoService from "../video/video.service";
import { CreateInstructorRequestDto } from "./dto/create-instructor-request.dto";
import InstructorRequest from "./schema/instructorRequest.schema";
import AppError from "../custom/AppError";
import { FilterInstructorRequestDto } from "./dto/filter-request.dto";

export default class InstructorRequestService {
  static create = async (
    createInstructorRequestDto: CreateInstructorRequestDto,
    userId: string
  ) => {
    let existRequest = await InstructorRequest.exists({ userId, status: 1 });
    if (existRequest)
      throw new AppError("You have already submitted a request", 400);

    let res = await InstructorRequest.create({
      ...createInstructorRequestDto,
      userId,
    });

    return {
      status: 201,
      message: "Create request successfully",
      data: res,
    };
  };

  static getInstructorRequests = async (
    filter: FilterInstructorRequestDto,
    page: number,
    limit: number
  ) => {
    let { searchQuery, resultQuery, sortBy, sortDescending, ...filterCourse } =
      filter;

    sortDescending = parseBoolean(sortDescending);

    const defaultLimit = limit ? limit : 10;
    const defaultPage = page ? page : 1;
    const skip = (defaultPage - 1) * defaultLimit;

    const userIdsList = await User.find({
      username: new RegExp(searchQuery, "i"),
    }).distinct("_id");

    // todo
    const resultCount = (
      await InstructorRequest.find({
        userId: { $in: userIdsList },
        result: new RegExp(resultQuery, "i"),
        ...filterCourse,
      })
    ).length;
    const totalPages = Math.ceil(resultCount / defaultLimit);

    let res = await InstructorRequest.find({
      userId: { $in: userIdsList },
      result: new RegExp(resultQuery, "i"),
      ...filterCourse,
    })
      .skip(skip)
      .limit(defaultLimit)
      .sort(sortDescending ? `-${sortBy}` : `${sortBy}`);

    let requestList = await Promise.all(
      res.map(async (request, index) => {
        const user = await User.findById(request.userId);

        let createTime = moment(request.createdAt).format(
          "ddd MMM DD YYYY HH:mm:ss"
        );
        let updateTime = moment(request.updatedAt).format(
          "ddd MMM DD YYYY HH:mm:ss"
        );
        const { createdAt, updatedAt, userId, ...data } = request.toObject();

        return {
          id: request._id,
          username: user?.username,
          userImg: user?.image?.url,
          createdAt: createTime,
          updatedAt: updateTime,
          ...data,
        };
      })
    );

    return {
      status: 200,
      message: "Get instructor requests successfully",
      data: {
        pageIndex: defaultPage,
        pageSize: defaultLimit,
        totalPages,
        resultCount,
        items: requestList,
      },
    };
  };

  static updateStatus = async (requestId: string, status: string) => {
    let userId = (await InstructorRequest.findById(requestId))?.userId;

    // approve or reject request
    if (status === "approved") {
      await User.findByIdAndUpdate(userId, { role: 2 });
    }

    let res = await InstructorRequest.findByIdAndUpdate(requestId, {
      status: 0,
      result: status,
    });

    return {
      status: 200,
      message: "Process request successfully",
      data: res,
    };
  };
}
