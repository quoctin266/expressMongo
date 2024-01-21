import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const quizSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    isDeleted: { type: Boolean, default: false },
    sectionId: { type: Schema.Types.ObjectId, ref: "section" },
    courseId: { type: Schema.Types.ObjectId, ref: "course" },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Quiz = mongoose.model("quiz", quizSchema);

export default Quiz;
