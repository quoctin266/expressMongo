import AppError from "../custom/AppError";
import Question from "../question/schema/question.schema";
import { hasSameElements } from "../util/library";
import { CreateQuizAttemptDto } from "./dto/create-quiz-attempt.dto";
import QuizAttempt from "./schema/quizAttempt.schema";

export default class QuizAttemptService {
  static create = async (createQuizAttemptDto: CreateQuizAttemptDto) => {
    const { quizId, questions, userId } = createQuizAttemptDto;
    let quizQuestions = await Question.find({ quizId });

    let isPassed = false;
    let correctQuestion: any[] = [];
    let totalPoint = 0;
    let userPoint = 0;

    quizQuestions.forEach((question) => {
      totalPoint += question.point as number;
      questions.forEach((result) => {
        if (question.id === result.questionId) {
          let correctAnswers = question.correctAnswers.map(
            (answer) => answer.content as string
          );
          let userAnswers: string[] = [];
          result.userAnswers.forEach((answer) => {
            question.answers.forEach((item) => {
              if (item.id === answer) userAnswers.push(item.content as string);
            });
          });

          if (hasSameElements(correctAnswers, userAnswers))
            correctQuestion.push(question);
        }
      });
    });

    correctQuestion.forEach((question) => {
      userPoint += question.point;
    });

    let point = (userPoint / totalPoint) * 100;
    if (point > 80) isPassed = true;

    let res = await QuizAttempt.create({ userId, quizId, isPassed, point });

    return {
      status: 201,
      message: "Submit quiz successfully",
      data: res,
    };
  };

  //   static getCoursequizes = async (courseId: string) => {
  //     let course = await Course.findById(courseId).exec();
  //     if (!course) throw new AppError("Course not found", 400);

  //     let res = await Quiz.find({ courseId, isDeleted: false });

  //     return {
  //       status: 200,
  //       message: "Get course's quizes successfully",
  //       data: res,
  //     };
  //   };

  //   static update = async (quizId: string, updateQuizDto: UpdateQuizDto) => {
  //     let quiz = await Quiz.findById(quizId).exec();
  //     if (!quiz) throw new AppError("Quiz does not exist", 400);

  //     let res = await Quiz.findByIdAndUpdate(quizId, {
  //       ...updateQuizDto,
  //     });

  //     return {
  //       status: 200,
  //       message: "Update quiz successfully",
  //       data: res,
  //     };
  //   };

  //   static delete = async (quizId: string) => {
  //     let quiz = await Quiz.findById(quizId).exec();
  //     if (!quiz) throw new AppError("Quiz does not exist", 400);

  //     let res = await Quiz.findByIdAndUpdate(quizId, { isDeleted: true });

  //     return {
  //       status: 200,
  //       message: "Delete quiz successfully",
  //       data: res,
  //     };
  //   };
}
