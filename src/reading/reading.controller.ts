import { Request, Response } from "express";
import ReadingService from "./reading.service";
import { CreateReadingDto } from "./dto/create-reading.dto";
import { UpdateReadingDto } from "./dto/update-reading.dto";

export default class ReadingController {
  static async create(req: Request, res: Response) {
    const { courseId } = req.params;
    let result = await ReadingService.create(
      courseId,
      req.body as CreateReadingDto
    );

    res.status(result.status).json(result);
  }

  static async getReadings(req: Request, res: Response) {
    const { courseId } = req.params;
    let result = await ReadingService.getCourseReadings(courseId);

    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const { readingId } = req.params;

    let result = await ReadingService.update(
      readingId,
      req.body as UpdateReadingDto
    );

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { readingId } = req.params;
    let result = await ReadingService.delete(readingId);

    res.status(result.status).json(result);
  }
}
