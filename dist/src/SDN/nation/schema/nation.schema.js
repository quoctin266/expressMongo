"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// const mongoose_delete = require("mongoose-delete");
const nationSchema = new mongoose_1.default.Schema({
    name: String,
    description: String,
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
}, { timestamps: true });
// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Nation = mongoose_1.default.model("nation", nationSchema);
exports.default = Nation;
