import mongoose, { Schema } from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const playerSchema = new mongoose.Schema(
  {
    name: String,
    club: String,
    img: String,
    info: String,
    goals: Number,
    isCaptain: { type: Boolean, default: false },
    nation: { type: Schema.Types.ObjectId, ref: "nation" },
    isDeleted: { type: Boolean, select: false, default: false },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Player = mongoose.model("player", playerSchema);

export default Player;
