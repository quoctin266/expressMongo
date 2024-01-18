import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const attemptRecordSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    quizId: { type: Schema.Types.ObjectId, ref: "quiz" },
    count: Number,
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const AttemptRecord = mongoose.model("attemptRecord", attemptRecordSchema);

export default AttemptRecord;
