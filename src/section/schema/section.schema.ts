import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const sectionSchema = new mongoose.Schema(
  {
    name: String,
    courseId: { type: Schema.Types.ObjectId, ref: "course" },
    isDeleted: { type: Boolean, select: false, default: false },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Section = mongoose.model("section", sectionSchema);

export default Section;
