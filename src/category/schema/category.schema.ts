import mongoose from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const categorySchema = new mongoose.Schema(
  {
    name: String,
    isDeleted: { type: Boolean, select: false, default: false },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Category = mongoose.model("category", categorySchema);

export default Category;
