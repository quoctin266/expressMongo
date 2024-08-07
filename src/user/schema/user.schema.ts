import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: { type: String, select: false },
    firstName: String,
    lastName: String,
    address: String,
    email: String,
    phone: String,
    dob: Date,
    description: String,
    biography: String,
    image: { url: String, key: String },
    status: { type: Number, default: 0 },
    role: { type: Number, default: 1 },
    otp: { type: Number, default: 999999 },
    refreshToken: String,
    isVerified: { type: Boolean, default: false },
    cart: [{ type: Schema.Types.ObjectId, ref: "course" }],
    purchasedCourses: [{ type: Schema.Types.ObjectId, ref: "course" }],
    googleAuth: { type: Boolean, default: false },
    paypalAccount: String,
    expoPushToken: String,
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const User = mongoose.model("user", userSchema);

export default User;
