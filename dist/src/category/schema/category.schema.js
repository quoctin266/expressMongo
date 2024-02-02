"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// const mongoose_delete = require("mongoose-delete");
const categorySchema = new mongoose_1.default.Schema({
    name: String,
    isDeleted: { type: Boolean, select: false, default: false },
    createdAt: { type: Date, select: false },
    updatedAt: { type: Date, select: false },
}, { timestamps: true });
// customerSchema.plugin(mongoose_delete, { overrideMethods: "all" });
const Category = mongoose_1.default.model("category", categorySchema);
exports.default = Category;
