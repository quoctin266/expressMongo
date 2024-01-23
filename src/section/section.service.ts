import Course from "../course/schema/course.schema";
import AppError from "../custom/AppError";
import { CreateSectionDto } from "./dto/create-section.dto";
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

  //   static update = async (id: string, name: string) => {
  //     let category = await Category.findOne({ name }).exec();
  //     if (category && category.id !== id)
  //       throw new AppError("Category already exist", 400);

  //     let res = await Category.findByIdAndUpdate(id, { name });

  //     return {
  //       status: 200,
  //       message: "Update category successfully",
  //       data: res,
  //     };
  //   };

  //   static delete = async (id: string) => {
  //     let category = await Category.findById(id).exec();
  //     if (!category) throw new AppError("Category does not exist", 404);

  //     let res = await Category.findByIdAndUpdate(id, { isDeleted: true });

  //     return {
  //       status: 200,
  //       message: "Delete category successfully",
  //       data: res,
  //     };
  //   };

  //   static getDetail = async (id: string) => {
  //     let res = await Category.findById(id);

  //     return {
  //       status: 200,
  //       message: "Get category detail successfully",
  //       data: res,
  //     };
  //   };
}
