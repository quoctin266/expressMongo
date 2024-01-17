import Course from "../course/schema/course.schema";
import AppError from "../custom/AppError";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";
import Quiz from "./schema/quiz.schema";

export default class QuizService {
  static create = async (courseId: string, createQuizDto: CreateQuizDto) => {
    let course = await Course.findById(courseId).exec();
    if (!course) throw new AppError("Course not found", 400);

    let res = await Quiz.create({ ...createQuizDto, courseId });

    return {
      status: 201,
      message: "Create quiz successfully",
      data: res,
    };
  };

  static getCoursequizes = async (courseId: string) => {
    let course = await Course.findById(courseId).exec();
    if (!course) throw new AppError("Course not found", 400);

    let res = await Quiz.find({ courseId, isDeleted: false });

    return {
      status: 200,
      message: "Get course's quizes successfully",
      data: res,
    };
  };

  static update = async (quizId: string, updateQuizDto: UpdateQuizDto) => {
    let quiz = await Quiz.findById(quizId).exec();
    if (!quiz) throw new AppError("Quiz does not exist", 400);

    let res = await Quiz.findByIdAndUpdate(quizId, {
      ...updateQuizDto,
    });

    return {
      status: 200,
      message: "Update quiz successfully",
      data: res,
    };
  };

  static delete = async (quizId: string) => {
    let quiz = await Quiz.findById(quizId).exec();
    if (!quiz) throw new AppError("Quiz does not exist", 400);

    let res = await Quiz.findByIdAndUpdate(quizId, { isDeleted: true });

    return {
      status: 200,
      message: "Delete quiz successfully",
      data: res,
    };
  };
}
