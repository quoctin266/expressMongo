import mongoose from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const nationSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Nation = mongoose.model("nation", nationSchema);

export default Nation;
