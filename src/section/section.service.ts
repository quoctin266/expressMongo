import Course from "../course/schema/course.schema";
import AppError from "../custom/AppError";
import Question from "../question/schema/question.schema";
import Quiz from "../quiz/schema/quiz.schema";
import Reading from "../reading/schema/reading.schema";
import Video from "../video/schema/video.schema";
import { CreateSectionDto } from "./dto/create-section.dto";
import { UpdateSectionDto } from "./dto/update-section.dto";
import Section from "./schema/section.schema";

export default class SectionService {
  static create = async (createSectionDto: CreateSectionDto) => {
    const { courseId } = createSectionDto;

    let course = await Course.findById(courseId).exec();
    if (!course) throw new AppError("Course does not exist", 400);

    let res = await Section.create({ ...createSectionDto });

    return {
      status: 201,
      message: "Create new section successfully",
      data: res,
    };
  };

  static getCourseSections = async (courseId: string) => {
    let course = await Course.findById(courseId).exec();
    if (!course) throw new AppError("Course not found", 400);

    let res = await Section.find({ courseId, isDeleted: false });

    return {
      status: 200,
      message: "Get course's sections successfully",
      data: res,
    };
  };

  static update = async (id: string, updateSectionDto: UpdateSectionDto) => {
    let section = await Section.findById(id).exec();
    if (!section) throw new AppError("Section does not exist", 400);

    let res = await Section.findByIdAndUpdate(id, { ...updateSectionDto });

    return {
      status: 200,
      message: "Update section successfully",
      data: res,
    };
  };

  static delete = async (sectionId: string) => {
    let section = await Section.findById(sectionId).exec();
    if (!section) throw new AppError("Section does not exist", 404);

    // delete all questions of section quizes
    const sectionQuizes = await Quiz.find({ sectionId, isDeleted: false });
    for (const quiz of sectionQuizes) {
      await Question.updateMany({ quizId: quiz.id }, { isDeleted: true });
    }

    await Quiz.updateMany({ sectionId }, { isDeleted: true });
    await Video.updateMany({ sectionId }, { isDeleted: true });
    await Reading.updateMany({ sectionId }, { isDeleted: true });

    let res = await Section.findByIdAndUpdate(sectionId, { isDeleted: true });

    return {
      status: 200,
      message: "Delete section successfully",
      data: res,
    };
  };

  //   static getDetail = async (id: string) => {
  //     let res = await Category.findById(id);

  //     return {
  //       status: 200,
  //       message: "Get category detail successfully",
  //       data: res,
  //     };
  //   };
}
