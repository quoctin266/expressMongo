import AppError from "../custom/AppError";
import { parseBoolean } from "../util/library";
import { CourseFilterDto } from "./dto/course-filter.dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import Course from "./schema/course.schema";

export default class CourseService {
  static createNewCourse = async (createCourseDto: CreateCourseDto) => {
    const { title } = createCourseDto;

    let course = await Course.findOne({ title }).exec();
    if (course) throw new AppError("Course title already exist", 409);

    let result = await Course.create({ ...createCourseDto });

    return {
      status: 201,
      message: "Create new course successfully",
      data: result,
    };
  };

  static getCourseList = async (
    filter: CourseFilterDto,
    page: number,
    limit: number
  ) => {
    let { searchQuery, sortBy, sortDescending, ...filterCourse } = filter;

    sortDescending = parseBoolean(sortDescending);

    const defaultLimit = limit ? limit : 10;
    const skip = ((page ? page : 1) - 1) * defaultLimit;

    const resultCount = (
      await Course.find({
        isDeleted: false,
        title: new RegExp(searchQuery, "i"),
        ...filterCourse,
      })
    ).length;
    const totalPages = Math.ceil(resultCount / defaultLimit);

    let res = await Course.find({
      title: new RegExp(searchQuery, "i"),
      ...filterCourse,
    })
      .select("+createdAt")
      .skip(skip)
      .limit(defaultLimit)
      .sort(sortDescending ? `-${sortBy}` : `${sortBy}`);

    return {
      status: 200,
      message: "Get course list successfully",
      data: {
        pageIndex: page ? page : 1,
        pageSize: defaultLimit,
        totalPages,
        resultCount,
        items: res,
      },
    };
  };
}
