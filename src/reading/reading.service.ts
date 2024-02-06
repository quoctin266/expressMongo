import Course from "../course/schema/course.schema";
import AppError from "../custom/AppError";
import { CreateReadingDto } from "./dto/create-reading.dto";
import { UpdateReadingDto } from "./dto/update-reading.dto";
import Reading from "./schema/reading.schema";

export default class ReadingService {
  static create = async (
    courseId: string,
    createReadingDto: CreateReadingDto
  ) => {
    let course = await Course.findById(courseId).exec();
    if (!course) throw new AppError("Course not found", 400);

    let res = await Reading.create({ ...createReadingDto, courseId });

    return {
      status: 201,
      message: "Create reading successfully",
      data: res,
    };
  };

  static getCourseReadings = async (courseId: string) => {
    let course = await Course.findById(courseId).exec();
    if (!course) throw new AppError("Course not found", 400);

    let res = await Reading.find({ courseId, isDeleted: false });

    return {
      status: 200,
      message: "Get course's readings successfully",
      data: res,
    };
  };

  static getSectionReadings = async (sectionId: string) => {
    let res = await Reading.find({ sectionId, isDeleted: false }).select([
      "-courseId",
      "-sectionId",
    ]);

    return {
      status: 200,
      message: "Get section's readings successfully",
      data: res,
    };
  };

  static update = async (
    readingId: string,
    updateReadingDto: UpdateReadingDto
  ) => {
    let reading = await Reading.findById(readingId).exec();
    if (!reading) throw new AppError("Reading does not exist", 400);

    let res = await Reading.findByIdAndUpdate(readingId, {
      ...updateReadingDto,
    });

    return {
      status: 200,
      message: "Update reading successfully",
      data: res,
    };
  };

  static delete = async (readingId: string) => {
    let reading = await Reading.findById(readingId).exec();
    if (!reading) throw new AppError("Reading does not exist", 400);

    let res = await Reading.findByIdAndUpdate(readingId, { isDeleted: true });

    return {
      status: 200,
      message: "Delete reading successfully",
      data: res,
    };
  };
}
