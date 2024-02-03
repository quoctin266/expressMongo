import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const videoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    fileName: { url: String, key: String },
    sectionId: { type: Schema.Types.ObjectId, ref: "section" },
    courseId: { type: Schema.Types.ObjectId, ref: "course" },
    isDeleted: { type: Boolean, select: false, default: false },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Video = mongoose.model("video", videoSchema);

export default Video;
