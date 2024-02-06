import Course from "../course/schema/course.schema";
import AppError from "../custom/AppError";
import User from "../user/schema/user.schema";
import { parseBoolean } from "../util/library";
import { CreateCourseRequestDto } from "./dto/create-course-request.dto";
import { FilterCourseRequestDto } from "./dto/filter-request.dto";
import CourseRequest from "./schema/courseRequest.schema";

export default class CourseRequestService {
  static create = async (createCourseRequestDto: CreateCourseRequestDto) => {
    let res = await CourseRequest.create({ ...createCourseRequestDto });

    return {
      status: 201,
      message: "Create request successfully",
      data: res,
    };
  };

  static getCourseRequests = async (
    filter: FilterCourseRequestDto,
    page: number,
    limit: number
  ) => {
    let { searchQuery, sortBy, sortDescending, ...filterCourse } = filter;

    sortDescending = parseBoolean(sortDescending);

    const defaultLimit = limit ? limit : 10;
    const skip = ((page ? page : 1) - 1) * defaultLimit;

    const userIdsList = await User.find({
      username: new RegExp(searchQuery, "i"),
    }).distinct("_id");

    // todo
    const resultCount = (
      await CourseRequest.find({
        userId: { $in: userIdsList },
        ...filterCourse,
      })
    ).length;
    const totalPages = Math.ceil(resultCount / defaultLimit);

    let res = await CourseRequest.find({
      userId: { $in: userIdsList },
      ...filterCourse,
    })
      .skip(skip)
      .limit(defaultLimit)
      .sort(sortDescending ? `-${sortBy}` : `${sortBy}`);

    return {
      status: 200,
      message: "Get course requests successfully",
      data: {
        pageIndex: page ? page : 1,
        pageSize: defaultLimit,
        totalPages,
        resultCount,
        items: res,
      },
    };
  };

  static updateStatus = async (requestId: string) => {
    let res = await CourseRequest.findByIdAndUpdate(requestId, {
      status: 0,
    });

    return {
      status: 200,
      message: "Update request status successfully",
      data: res,
    };
  };
}
