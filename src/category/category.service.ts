import AppError from "../custom/AppError";
import Category from "./schema/category.schema";

export default class CategoryService {
  static create = async (name: string) => {
    let category = await Category.findOne({ name }).exec();
    if (category) throw new AppError("Category already exist", 400);

    let res = await Category.create({ name });

    return {
      status: 201,
      message: "Create new category successfully",
      data: res,
    };
  };

  static getList = async () => {
    let res = await Category.find({ isDeleted: false });

    return {
      status: 200,
      message: "Get category list successfully",
      data: res,
    };
  };

  static update = async (id: string, name: string) => {
    let category = await Category.findOne({ name }).exec();
    if (category && category.id !== id)
      throw new AppError("Category already exist", 400);

    let res = await Category.findByIdAndUpdate(id, { name });

    return {
      status: 200,
      message: "Update category successfully",
      data: res,
    };
  };

  static delete = async (id: string) => {
    let category = await Category.findById(id).exec();
    if (!category) throw new AppError("Category does not exist", 404);

    let res = await Category.findByIdAndUpdate(id, { isDeleted: true });

    return {
      status: 200,
      message: "Delete category successfully",
      data: res,
    };
  };

  static getDetail = async (id: string) => {
    let res = await Category.findById(id);

    return {
      status: 200,
      message: "Get category detail successfully",
      data: res,
    };
  };
}
