import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const feedbackSchema = new mongoose.Schema(
  {
    comment: String,
    rating: Number,
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    courseId: { type: Schema.Types.ObjectId, ref: "course" },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Feedback = mongoose.model("feedback", feedbackSchema);

export default Feedback;
