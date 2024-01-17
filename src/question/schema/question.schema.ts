import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const questionSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    point: Number,
    choiceType: Number,
    isDeleted: { type: Boolean, default: false },
    quizId: { type: Schema.Types.ObjectId, ref: "quiz" },
    answers: [
      {
        id: Schema.Types.ObjectId,
        content: String,
      },
    ],
    correctAnswers: [
      {
        id: Schema.Types.ObjectId,
        content: String,
      },
    ],
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Question = mongoose.model("question", questionSchema);

export default Question;
