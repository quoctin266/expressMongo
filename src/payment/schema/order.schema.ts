import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const orderSchema = new mongoose.Schema(
  {
    orderStatus: { type: Number, default: 0 },
    totalPrice: Number,
    paymentMethod: { type: String, default: "Paypal" },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
    courseId: [{ type: Schema.Types.ObjectId, ref: "course" }],
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Order = mongoose.model("order", orderSchema);

export default Order;
