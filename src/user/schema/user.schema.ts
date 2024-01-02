import mongoose from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: String,
    firstname: String,
    lastname: String,
    address: String,
    email: String,
    phone: String,
    dob: Date,
    status: Boolean,
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Customer = mongoose.model("user", userSchema);

export default Customer;
