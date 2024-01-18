export class CreateQuizAttemptDto {
  userId: string;

  quizId: string;

  questions: {
    questionId: string;
    userAnswers: string[];
  }[];
}
