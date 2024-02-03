import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const questionSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    point: Number,
    choiceType: Number,
    image: { url: String, key: String },
    isDeleted: { type: Boolean, default: false },
    quizId: { type: Schema.Types.ObjectId, ref: "quiz" },
    answers: [
      {
        content: String,
      },
    ],
    correctAnswers: [
      {
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
