import { Request, Response } from "express";
import QuizService from "./quiz.service";
import { CreateQuizDto } from "./dto/create-quiz.dto";
import { UpdateQuizDto } from "./dto/update-quiz.dto";

export default class QuizController {
  static async create(req: Request, res: Response) {
    const { courseId } = req.params;
    let result = await QuizService.create(courseId, req.body as CreateQuizDto);

    res.status(result.status).json(result);
  }

  static async getQuizes(req: Request, res: Response) {
    const { courseId } = req.params;
    let result = await QuizService.getCoursequizes(courseId);

    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const { quizId } = req.params;

    let result = await QuizService.update(quizId, req.body as UpdateQuizDto);

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { quizId } = req.params;
    let result = await QuizService.delete(quizId);

    res.status(result.status).json(result);
  }
}
