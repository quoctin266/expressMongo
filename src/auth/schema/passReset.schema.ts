import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const passResetSchema = new mongoose.Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const PassReset = mongoose.model("passReset", passResetSchema);

export default PassReset;
