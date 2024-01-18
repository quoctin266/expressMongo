import { Request, Response } from "express";
import QuizAttemptService from "./quizAttempt.service";
import { CreateQuizAttemptDto } from "./dto/create-quiz-attempt.dto";

export default class QuizAttemptController {
  static async create(req: Request, res: Response) {
    let result = await QuizAttemptService.create(
      req.body as CreateQuizAttemptDto
    );

    res.status(result.status).json(result);
  }

  //   static async getQuizes(req: Request, res: Response) {
  //     const { courseId } = req.params;
  //     let result = await QuizService.getCoursequizes(courseId);

  //     res.status(result.status).json(result);
  //   }

  //   static async update(req: Request, res: Response) {
  //     const { quizId } = req.params;

  //     let result = await QuizService.update(quizId, req.body as UpdateQuizDto);

  //     res.status(result.status).json(result);
  //   }

  //   static async delete(req: Request, res: Response) {
  //     const { quizId } = req.params;
  //     let result = await QuizService.delete(quizId);

  //     res.status(result.status).json(result);
  //   }
}
