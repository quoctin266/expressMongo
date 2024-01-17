import { Request, Response } from "express";
import QuestionService from "./question.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { UpdateQuestionDto } from "./dto/update-question.dto";

export default class QuestionController {
  static async create(req: Request, res: Response) {
    const { quizId } = req.params;
    let result = await QuestionService.create(
      quizId,
      req.body as CreateQuestionDto
    );

    res.status(result.status).json(result);
  }

  static async getQuestions(req: Request, res: Response) {
    const { quizId } = req.params;
    let result = await QuestionService.getQuizQuestions(quizId);

    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const { questionId } = req.params;

    let result = await QuestionService.update(
      questionId,
      req.body as UpdateQuestionDto
    );

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { questionId } = req.params;
    let result = await QuestionService.delete(questionId);

    res.status(result.status).json(result);
  }
}
