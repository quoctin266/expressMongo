import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const courseRequestSchema = new mongoose.Schema(
  {
    type: String,
    status: { type: Number, default: 1 },
    result: { type: String, default: "pending" },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    courseId: { type: Schema.Types.ObjectId, ref: "course" },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const CourseRequest = mongoose.model("courseRequest", courseRequestSchema);

export default CourseRequest;
