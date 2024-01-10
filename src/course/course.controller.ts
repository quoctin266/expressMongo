import { Request, Response } from "express";
import CourseService from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";
import { CourseFilterDto } from "./dto/course-filter.dto";

export default class CourseController {
  static async create(req: Request, res: Response) {
    let result = await CourseService.createNewCourse(
      req.body as CreateCourseDto
    );

    res.status(result.status).json(result);
  }

  static async getDetail(req: Request, res: Response) {}

  static async update(req: Request, res: Response) {}

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
}
