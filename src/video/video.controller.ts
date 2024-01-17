import { Request, Response } from "express";
import VideoService from "./video.service";
import { CreateVideoDto } from "./dto/create-video.dto";
import { UpdateVideoDto } from "./dto/update-video.dto";

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

  static async updateInfo(req: Request, res: Response) {
    const { videoId } = req.params;

    let result = await VideoService.updateInfo(
      videoId,
      req.body as UpdateVideoDto
    );

    res.status(result.status).json(result);
  }

  static async updateFile(req: Request, res: Response) {
    const { videoId } = req.params;

    let result = await VideoService.updateFile(req, videoId);

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { videoId } = req.params;
    let result = await VideoService.delete(videoId);

    res.status(result.status).json(result);
  }
}
