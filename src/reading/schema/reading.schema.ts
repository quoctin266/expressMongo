import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const readingSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    description: String,
    isDeleted: { type: Boolean, default: false },
    courseId: { type: Schema.Types.ObjectId, ref: "course" },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Reading = mongoose.model("reading", readingSchema);

export default Reading;
