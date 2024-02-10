import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const instructorRequestSchema = new mongoose.Schema(
  {
    status: { type: Number, default: 1 },
    description: String,
    result: { type: String, default: "pending" },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const InstructorRequest = mongoose.model(
  "instructorRequest",
  instructorRequestSchema
);

export default InstructorRequest;
