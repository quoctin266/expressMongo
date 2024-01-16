import { Request, Response } from "express";
import VideoService from "./video.service";
import { CreateVideoDto } from "./dto/create-video.dto";

export default class VideoController {
  static async create(req: Request, res: Response) {
    const { courseId } = req.params;
    let result = await VideoService.create(
      req,
      req.body as CreateVideoDto,
      courseId
    );

    res.status(result.status).json(result);
  }

  static async getVideos(req: Request, res: Response) {
    const { courseId } = req.params;
    let result = await VideoService.getCourseVideos(courseId);

    res.status(result.status).json(result);
  }

  //   static async update(req: Request, res: Response) {
  //     const { readingId } = req.params;

  //     let result = await ReadingService.update(
  //       readingId,
  //       req.body as UpdateReadingDto
  //     );

  //     res.status(result.status).json(result);
  //   }

  //   static async delete(req: Request, res: Response) {
  //     const { readingId } = req.params;
  //     let result = await ReadingService.delete(readingId);

  //     res.status(result.status).json(result);
  //   }
}
