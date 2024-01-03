import mongoose from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: { type: String, select: false },
    firstname: String,
    lastname: String,
    address: String,
    email: String,
    phone: String,
    dob: Date,
    status: { type: Number, default: 1 },
    role: { type: Number, default: 1 },
    resfreshToken: String,
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const User = mongoose.model("user", userSchema);

export default User;
