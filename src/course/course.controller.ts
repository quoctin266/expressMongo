import { Request, Response } from "express";
import CourseService from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CourseFilterDto } from "./dto/course-filter.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

export default class CourseController {
  static async create(req: Request, res: Response) {
    let result = await CourseService.createNewCourse(
      req,
      req.body as CreateCourseDto
    );

    res.status(result.status).json(result);
  }

  static async getDetail(req: Request, res: Response) {
    const { id } = req.params;

    let result = await CourseService.getCourseDetail(id);

    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;

    let result = await CourseService.updateCourse(
      id,
      req,
      req.body as UpdateCourseDto
    );

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;

    let result = await CourseService.deleteCourse(id);

    res.status(result.status).json(result);
  }

  static async getcoursesList(req: Request, res: Response) {
    const {
      pageIndex,
      pageSize,
      ...filter
    }: { pageIndex: number; pageSize: number } = req.query as any;

    let result = await CourseService.getCourseList(
      filter as CourseFilterDto,
      +pageIndex,
      +pageSize
    );

    res.status(result.status).json(result);
  }

  static async getCourseStudents(req: Request, res: Response) {
    const { courseId } = req.params;

    let result = await CourseService.getCourseStudentList(courseId);

    res.status(result.status).json(result);
  }

  static async getUserCoursesList(req: Request, res: Response) {
    const { userId } = req.params;

    let result = await CourseService.getUserCoursesList(userId);

    res.status(result.status).json(result);
  }
}
