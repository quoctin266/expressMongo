export class CreateQuestionDto {
  title: string;

  content: string;

  point: Number;

  choiceType: Number;

  answers: string[];

  correctAnswers: string[];
}
