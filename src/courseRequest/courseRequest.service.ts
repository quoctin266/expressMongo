import moment from "moment";
import Category from "../category/schema/category.schema";
import Course from "../course/schema/course.schema";
import AppError from "../custom/AppError";
import QuizService from "../quiz/quiz.service";
import ReadingService from "../reading/reading.service";
import SectionService from "../section/section.service";
import User from "../user/schema/user.schema";
import { parseBoolean } from "../util/library";
import VideoService from "../video/video.service";
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
    let { typeQuery, searchQuery, sortBy, sortDescending, ...filterCourse } =
      filter;

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
        type: new RegExp(typeQuery, "i"),
        ...filterCourse,
      })
    ).length;
    const totalPages = Math.ceil(resultCount / defaultLimit);

    let res = await CourseRequest.find({
      userId: { $in: userIdsList },
      type: new RegExp(typeQuery, "i"),
      ...filterCourse,
    })
      .skip(skip)
      .limit(defaultLimit)
      .sort(sortDescending ? `-${sortBy}` : `${sortBy}`);

    let requestList = await Promise.all(
      res.map(async (request, index) => {
        const user = await User.findById(request.userId);
        const course = await Course.findById(request.courseId).select([
          "-creatorId",
          "-students",
        ]);
        const category = await Category.findById(course?.categoryId);
        const sectionsData = (
          await SectionService.getCourseSections(course?.id)
        ).data;

        const sections = await Promise.all(
          sectionsData.map(async (section) => {
            delete section.courseId;
            const videos = (await VideoService.getSectionVideos(section.id))
              .data;

            const readings = (
              await ReadingService.getSectionReadings(section.id)
            ).data;

            const quizes = (await QuizService.getSectionQuizes(section.id))
              .data;

            return {
              ...section.toObject(),
              videos,
              readings,
              quizes,
            };
          })
        );

        const courseData = {
          ...course?.toObject(),
          category: category?.name,
          image: course?.image?.url,
          sections,
        };

        delete courseData.categoryId;

        let date = moment(request.createdAt).format("ddd MMM DD YYYY HH:mm:ss");
        const { createdAt, userId, courseId, ...data } = request.toObject();

        return {
          index: index + 1,
          id: request._id,
          username: user?.username,
          createdAt: date,
          ...data,
          course: courseData,
        };
      })
    );

    return {
      status: 200,
      message: "Get course requests successfully",
      data: {
        pageIndex: page ? page : 1,
        pageSize: defaultLimit,
        totalPages,
        resultCount,
        items: requestList,
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
