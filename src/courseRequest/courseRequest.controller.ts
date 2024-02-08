import { Request, Response } from "express";
import CourseRequestService from "./courseRequest.service";
import { FilterCourseRequestDto } from "./dto/filter-request.dto";

export default class CourseRequestController {
  static async getCourseRequests(req: Request, res: Response) {
    const {
      pageIndex,
      pageSize,
      ...filter
    }: { pageIndex: number; pageSize: number } = req.query as any;

    let result = await CourseRequestService.getCourseRequests(
      filter as FilterCourseRequestDto,
      +pageIndex,
      +pageSize
    );

    res.status(result.status).json(result);
  }

  static async processRequest(req: Request, res: Response) {
    const { id } = req.params;

    let result = await CourseRequestService.updateStatus(
      id,
      req.body.status as string
    );

    res.status(result.status).json(result);
  }
}
