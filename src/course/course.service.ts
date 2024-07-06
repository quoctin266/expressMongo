import { Request } from "express";
import AppError from "../custom/AppError";
import User from "../user/schema/user.schema";
import { parseBoolean } from "../util/library";
import { CourseFilterDto } from "./dto/course-filter.dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";
import Course from "./schema/course.schema";
import FileService from "../file/file.service";
import { UploadedFile } from "express-fileupload";
import { Types } from "mongoose";
import Order from "../payment/schema/order.schema";
import CourseRequest from "../courseRequest/schema/courseRequest.schema";
import SocketConfig from "../util/socket.config";

export default class CourseService {
  static createNewCourse = async (
    req: Request,
    createCourseDto: CreateCourseDto
  ) => {
    const { title } = createCourseDto;

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new AppError("No files were uploaded", 400);
    }

    let course = await Course.findOne({ title, isDeleted: false }).exec();
    if (course) throw new AppError("Course title already exist", 409);

    let res = await FileService.uploadFileAWS(
      req,
      req.files.file as UploadedFile
    );

    let result = await Course.create({
      ...createCourseDto,
      image: res.data,
    });

    let requestCourse = {
      type: "Create Course",
      userId: (req as any).user.id,
      courseId: result.id,
    };

    await CourseRequest.create(requestCourse);

    return {
      status: 201,
      message: "Create new course successfully",
      data: result,
    };
  };

  static updateCourse = async (
    id: string,
    req: Request,
    updateCourseDto: UpdateCourseDto
  ) => {
    const { title } = updateCourseDto;

    let course = await Course.findOne({ title }).exec();
    if (course && course.id !== id)
      throw new AppError("Course title already exist", 409);

    const currentCourse = await Course.findById(id).exec();
    let res = null;
    if (req.files && Object.keys(req.files).length !== 0) {
      res = await FileService.uploadFileAWS(
        req,
        req.files.file as UploadedFile
      );

      await FileService.removeFileAWS(currentCourse?.image?.key as string);
    }

    const image = res?.data ? res.data : currentCourse?.image;
    let updateResult = await Course.findByIdAndUpdate(id, {
      ...updateCourseDto,
      image,
      status: "pending",
    });

    // create new request if no course request is active
    let existRequest = await CourseRequest.exists({ courseId: id, status: 1 });

    if (!existRequest) {
      let requestCourse = {
        type: "Edit Course",
        userId: (req as any).user.id,
        courseId: id,
      };
      await CourseRequest.create(requestCourse);
    }

    SocketConfig.emitUpdatedCourse(updateCourseDto);

    return {
      status: 200,
      message: "Update course successfully",
      data: updateResult,
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

    let courseList = res.map((course) => {
      const imageUrl = course.image?.url;

      const { image, ...rest } = course.toObject();

      return {
        ...rest,
        imageUrl,
      };
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
  };

  static getCourseDetail = async (id: string) => {
    let course = await Course.findById(id).select("+createdAt");

    const imageUrl = course?.image?.url;

    return {
      status: 200,
      message: "Get course detail successfully",
      data: {
        ...course?.toObject(),
        imageUrl,
      },
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
    let user = await User.findById(userId);

    let courseList = await Promise.all(
      (user?.purchasedCourses as Types.ObjectId[]).map(async (courseId) => {
        let course = await Course.findById(courseId);

        const imageUrl = course?.image?.url;

        let order = await Order.findOne({ userId, courseId }).select(
          "+createdAt"
        );

        return {
          ...course?.toObject(),
          imageUrl,
          purchasedDate: order?.createdAt,
        };
      })
    );

    return {
      status: 200,
      message: "Get user's courses list successfully",
      data: courseList,
    };
  };
}
