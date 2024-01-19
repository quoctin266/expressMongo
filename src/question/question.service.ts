import mongoose from "mongoose";
import AppError from "../custom/AppError";
import Quiz from "../quiz/schema/quiz.schema";
import { CreateQuestionDto } from "./dto/create-question.dto";
import Question from "./schema/question.schema";
import { UpdateQuestionDto } from "./dto/update-question.dto";
import { Request } from "express";
import FileService from "../file/file.service";
import { UploadedFile } from "express-fileupload";

export default class QuestionService {
  static create = async (
    quizId: string,
    req: Request,
    createQuestionDto: CreateQuestionDto
  ) => {
    let quiz = await Quiz.findById(quizId).exec();
    if (!quiz) throw new AppError("Quiz not found", 400);

    if (
      createQuestionDto.answers?.length === 0 ||
      createQuestionDto.correctAnswers?.length === 0
    )
      throw new AppError("Invalid or missing answers", 400);

    let uploadRes = null;
    if (req.files && Object.keys(req.files).length !== 0) {
      uploadRes = await FileService.uploadFile(
        req,
        req.files.file as UploadedFile
      );
    }

    const { answers, correctAnswers, ...createData } = createQuestionDto;

    let answersData = JSON.parse(answers as unknown as string).map(
      (item: string) => {
        return {
          content: item,
        };
      }
    );

    let correctAnswersData = JSON.parse(
      correctAnswers as unknown as string
    ).map((item: string) => {
      return {
        content: item,
      };
    });

    let res = await Question.create({
      ...createData,
      image: uploadRes?.data.fileName,
      quizId,
      answers: answersData,
      correctAnswers: correctAnswersData,
    });

    return {
      status: 201,
      message: "Create question successfully",
      data: res,
    };
  };

  static getQuizQuestions = async (quizId: string) => {
    let quiz = await Quiz.findById(quizId).exec();
    if (!quiz) throw new AppError("Quiz not found", 400);

    let res = await Question.find({ quizId, isDeleted: false });

    let questionList = res.map((question) => {
      const { answers, correctAnswers, ...questionInfo } = question.toObject();

      const answerIds = answers.map((answer) => answer._id);
      const answersArr = answers.map((answer) => answer.content);
      const correctAnswersArr = correctAnswers.map((answer) => answer.content);

      let imageUrl = null;
      if (question.image) {
        const domainName = process.env.DOMAIN as string;
        const port = process.env.PORT || "";
        imageUrl =
          domainName +
          port +
          FileService.createImageLink(question.image as string);
      }

      return {
        answers: answersArr,
        correctAnswers: correctAnswersArr,
        answerIds,
        imageUrl,
        ...questionInfo,
      };
    });

    return {
      status: 200,
      message: "Get quiz's questions successfully",
      data: questionList,
    };
  };

  static update = async (
    questionId: string,
    req: Request,
    updateQuestionDto: UpdateQuestionDto
  ) => {
    let question = await Question.findById(questionId).exec();
    if (!question) throw new AppError("Question not found", 400);

    if (
      updateQuestionDto.answers?.length === 0 ||
      updateQuestionDto.correctAnswers?.length === 0
    )
      throw new AppError("Invalid or missing answers", 400);

    let uploadRes = null;
    if (req.files && Object.keys(req.files).length !== 0) {
      uploadRes = await FileService.uploadFile(
        req,
        req.files.file as UploadedFile
      );

      await FileService.removeFile(question.image as string);
    }

    const { answers, correctAnswers, ...updateData } = updateQuestionDto;

    let answersData = JSON.parse(answers as unknown as string).map(
      (item: string) => {
        return {
          id: new mongoose.Types.ObjectId(),
          content: item,
        };
      }
    );

    let correctAnswersData = JSON.parse(
      correctAnswers as unknown as string
    ).map((item: string) => {
      return {
        id: new mongoose.Types.ObjectId(),
        content: item,
      };
    });

    let res = await Question.findByIdAndUpdate(questionId, {
      ...updateData,
      image: uploadRes?.data.fileName,
      answers: answersData,
      correctAnswers: correctAnswersData,
    });

    return {
      status: 200,
      message: "Update question successfully",
      data: res,
    };
  };

  static delete = async (questionId: string) => {
    let question = await Question.findById(questionId).exec();
    if (!question) throw new AppError("Question does not exist", 400);

    let res = await Question.findByIdAndUpdate(questionId, { isDeleted: true });

    return {
      status: 200,
      message: "Delete question successfully",
      data: res,
    };
  };
}
