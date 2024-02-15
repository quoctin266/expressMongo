import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const commentSchema = new mongoose.Schema(
  {
    comment: String,
    rating: Number,
    author: { type: Schema.Types.ObjectId, ref: "user" },
    player: { type: Schema.Types.ObjectId, ref: "player" },
    isDeleted: { type: Boolean, select: false, default: false },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Comment = mongoose.model("comment", commentSchema);

export default Comment;
