import { NextFunction, Request, Response } from "express";
import { CreateQuizAttemptDto } from "../quizAttempt/dto/create-quiz-attempt.dto";
import AttemptRecord from "../quizAttempt/schema/attempRecord.schema";
import AppError from "../custom/AppError";

export const requestLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, quizId } = req.body as CreateQuizAttemptDto;

  let record = await AttemptRecord.findOne({ userId, quizId }).exec();
  // Check if the user has exceeded the daily request limit
  if (record) {
    if (!record.count) {
      await AttemptRecord.findByIdAndUpdate(record.id, { count: 1 });
    } else if ((record.count as number) >= 3) {
      throw new AppError("Attempt limit exceeded", 429);
    } else {
      await AttemptRecord.findByIdAndUpdate(record.id, {
        count: record.count + 1,
      });
    }
  } else await AttemptRecord.create({ userId, quizId, count: 1 });
  next();
};
