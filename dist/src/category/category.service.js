"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../custom/AppError"));
const category_schema_1 = __importDefault(require("./schema/category.schema"));
class CategoryService {
}
_a = CategoryService;
CategoryService.create = (name) => __awaiter(void 0, void 0, void 0, function* () {
    let category = yield category_schema_1.default.findOne({ name }).exec();
    if (category)
        throw new AppError_1.default("Category already exist", 400);
    let res = yield category_schema_1.default.create({ name });
    return {
        status: 201,
        message: "Create new category successfully",
        data: res,
    };
});
CategoryService.getList = () => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield category_schema_1.default.find({ isDeleted: false });
    return {
        status: 200,
        message: "Get category list successfully",
        data: res,
    };
});
CategoryService.update = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    let category = yield category_schema_1.default.findOne({ name }).exec();
    if (category && category.id !== id)
        throw new AppError_1.default("Category already exist", 400);
    let res = yield category_schema_1.default.findByIdAndUpdate(id, { name });
    return {
        status: 200,
        message: "Update category successfully",
        data: res,
    };
});
CategoryService.delete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let category = yield category_schema_1.default.findById(id).exec();
    if (!category)
        throw new AppError_1.default("Category does not exist", 404);
    let res = yield category_schema_1.default.findByIdAndUpdate(id, { isDeleted: true });
    return {
        status: 200,
        message: "Delete category successfully",
        data: res,
    };
});
CategoryService.getDetail = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let res = yield category_schema_1.default.findById(id);
    return {
        status: 200,
        message: "Get category detail successfully",
        data: res,
    };
});
exports.default = CategoryService;
