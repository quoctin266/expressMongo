import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const quizAttemptSchema = new mongoose.Schema(
  {
    point: Number,
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    quizId: { type: Schema.Types.ObjectId, ref: "quiz" },
    isPassed: { type: Boolean, default: false },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const QuizAttempt = mongoose.model("quizAttempt", quizAttemptSchema);

export default QuizAttempt;
