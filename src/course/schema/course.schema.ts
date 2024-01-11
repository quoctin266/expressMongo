import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const courseSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    status: { type: Number, default: 1 },
    price: Number,
    creatorId: { type: Schema.Types.ObjectId, ref: "user" },
    categoryId: { type: Schema.Types.ObjectId, ref: "category" },
    isDeleted: { type: Boolean, select: false, default: false },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Course = mongoose.model("course", courseSchema);

export default Course;