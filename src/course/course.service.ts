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
import { ObjectId, Types } from "mongoose";

export default class CourseService {
  static createNewCourse = async (
    req: Request,
    createCourseDto: CreateCourseDto
  ) => {
    const { title } = createCourseDto;

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new AppError("No files were uploaded", 400);
    }

    let course = await Course.findOne({ title }).exec();
    if (course) throw new AppError("Course title already exist", 409);

    let res = await FileService.uploadFile(req, req.files.file as UploadedFile);

    let result = await Course.create({
      ...createCourseDto,
      image: res.data.fileName,
    });

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
    if (course && course._id.toString() !== id)
      throw new AppError("Course title already exist", 409);

    let res = null;
    if (req.files && Object.keys(req.files).length !== 0) {
      res = await FileService.uploadFile(req, req.files.file as UploadedFile);

      await FileService.removeFile(course?.image as string);
    }

    let updateResult = await Course.findByIdAndUpdate(id, {
      ...updateCourseDto,
      image: res?.data.fileName ? res.data.fileName : course?.image,
    });

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
      const domainName = process.env.DOMAIN as string;
      const port = process.env.PORT || "";
      const imageUrl =
        domainName + port + FileService.createImageLink(course.image as string);

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

    const domainName = process.env.DOMAIN as string;
    const port = process.env.PORT || "";
    const imageUrl =
      domainName + port + FileService.createImageLink(course?.image as string);

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

        const domainName = process.env.DOMAIN as string;
        const port = process.env.PORT || "";
        const imageUrl =
          domainName +
          port +
          FileService.createImageLink(course?.image as string);

        return {
          ...course?.toObject(),
          imageUrl,
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
