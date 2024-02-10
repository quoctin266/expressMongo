import { Request, Response } from "express";
import InstructorRequestService from "./instructorRequest.service";
import { CreateInstructorRequestDto } from "./dto/create-instructor-request.dto";
import { FilterInstructorRequestDto } from "./dto/filter-request.dto";

export default class InstructorRequestController {
  static async create(req: Request, res: Response) {
    const { id } = (req as any).user;

    let result = await InstructorRequestService.create(
      req.body as CreateInstructorRequestDto,
      id
    );

    res.status(result.status).json(result);
  }

  static async getInstructorRequests(req: Request, res: Response) {
    const {
      pageIndex,
      pageSize,
      ...filter
    }: { pageIndex: number; pageSize: number } = req.query as any;

    let result = await InstructorRequestService.getInstructorRequests(
      filter as FilterInstructorRequestDto,
      +pageIndex,
      +pageSize
    );

    res.status(result.status).json(result);
  }

  static async processRequest(req: Request, res: Response) {
    const { id } = req.params;

    let result = await InstructorRequestService.updateStatus(
      id,
      req.body.status as string
    );

    res.status(result.status).json(result);
  }
}
