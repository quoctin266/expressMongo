import mongoose from "mongoose";
// const mongoose_delete = require("mongoose-delete");

const playerSchema = new mongoose.Schema(
  {
    name: String,
    club: String,
    img: String,
    info: String,
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
  },
  { timestamps: true }
);

// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Player = mongoose.model("player", playerSchema);

export default Player;
