import { Request, Response } from "express";
import FeedbackService from "./feedback.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

export default class FeedbackController {
  static async create(req: Request, res: Response) {
    let result = await FeedbackService.create(req.body as CreateFeedbackDto);

    res.status(result.status).json(result);
  }

  static async getFeedbacks(req: Request, res: Response) {
    let result = await FeedbackService.getFeedbacks();

    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const { feedbackId } = req.params;

    let result = await FeedbackService.update(
      feedbackId,
      req.body as UpdateFeedbackDto
    );

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { feedbackId } = req.params;
    let result = await FeedbackService.delete(feedbackId);

    res.status(result.status).json(result);
  }
}
