import AppError from "../custom/AppError";
import User from "../user/schema/user.schema";
import { parseBoolean } from "../util/library";
import { CourseFilterDto } from "./dto/course-filter.dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
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

  static updateCourse = async (
    id: string,
    updateCourseDto: UpdateCourseDto
  ) => {
    const { title } = updateCourseDto;

    let course = await Course.findOne({ title }).exec();
    if (course && course._id.toString() !== id)
      throw new AppError("Course title already exist", 409);

    let result = await Course.findByIdAndUpdate(id, { ...updateCourseDto });

    return {
      status: 200,
      message: "Update course successfully",
      data: result,
    };
  };

  static deleteCourse = async (id: string) => {
    let course = await Course.findById(id).exec();
    if (!course) throw new AppError("Course not found", 404);

    let result = await Course.findByIdAndUpdate(id, { isDeleted: true });

    return {
      status: 200,
      message: "Delete course successfully",
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
      isDeleted: false,
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

  static getCourseDetail = async (id: string) => {
    let result = await Course.findById(id).select("+createdAt");

    return {
      status: 200,
      message: "Get course detail successfully",
      data: result,
    };
  };

  static getCourseStudentList = async (courseId: string) => {
    let course = await Course.findById(courseId).populate("students");

    return {
      status: 200,
      message: "Get course's students list successfully",
      data: course?.students,
    };
  };

  static getUserCoursesList = async (userId: string) => {
    let user = await User.findById(userId).populate(
      "purchasedCourses",
      "+createdAt"
    );

    return {
      status: 200,
      message: "Get user's courses list successfully",
      data: user?.purchasedCourses,
    };
  };
}
