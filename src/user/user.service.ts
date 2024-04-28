import User from "./schema/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt, { compare } from "bcryptjs";
import AppError from "../custom/AppError";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserFilterDto } from "./dto/user-filter.dto";
import { Request } from "express";
import FileService from "../file/file.service";
import { UploadedFile } from "express-fileupload";
import Course from "../course/schema/course.schema";
import CourseService from "../course/course.service";
import Category from "../category/schema/category.schema";
import { IUser } from "./user.interface";

export default class UserService {
  static hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  };

  static checkPassword = async (hash: string, password: string) => {
    return compare(password, hash);
  };

  static findOneByToken(refreshToken: string) {
    return User.findOne({ refreshToken });
  }

  static updateToken = async (token: string, id: string) => {
    await User.findByIdAndUpdate(id, { refreshToken: token });
  };

  static createNewUser = async (createUserDto: CreateUserDto) => {
    const { email, password } = createUserDto;

    let existUser = await User.findOne({ email }).exec();
    if (existUser) throw new AppError("Email already exist", 409);

    const hashPassword = await UserService.hashPassword(password);
    createUserDto.password = hashPassword;
    let result = await User.create({ ...createUserDto });

    return {
      status: 200,
      message: "Create new user successfully",
      data: result,
    };
  };

  static getDetail = async (id: string) => {
    let user = await User.findById(id);
    if (!user) throw new AppError("User not found", 404);

    let userCourses = await Course.find({
      creatorId: id,
      status: "approved",
    }).select("+createdAt");

    let studentCount = 0;
    let dataCourses = await Promise.all(
      userCourses.map(async (course) => {
        studentCount += course.students?.length as number;

        const category = await Category.findById(course.categoryId);
        const imageUrl = course.image?.url;

        const { image, categoryId, ...data } = course.toObject();

        return {
          ...data,
          imageUrl,
          category: category?.name,
        };
      })
    );

    const imageUrl = user.image?.url;

    const { image, ...data } = user.toObject();

    return {
      status: 200,
      message: "Get user detail successfully",
      data: { ...data, imageUrl, studentCount, dataCourses },
    };
  };

  static updateUser = async (
    id: string,
    updateUserDto: UpdateUserDto,
    req: Request
  ) => {
    const { username, status, file } = updateUserDto;

    const userToken: IUser = (req as any).user;
    if (userToken.id !== id && typeof status !== "boolean" && !status)
      throw new AppError("Not Allow", 403);

    let user = await User.findOne({ username }).exec();
    if (user && user.id !== id)
      throw new AppError("Username already exist", 409);

    const currentUser = await User.findById(id).exec();
    let res = null;
    if (req.files && Object.keys(req.files).length !== 0) {
      res = await FileService.uploadFileAWS(
        req,
        req.files.file as UploadedFile
      );

      if (currentUser?.image?.key)
        await FileService.removeFileAWS(currentUser?.image?.key as string);
    }

    if (file) {
      res = await FileService.uploadFileAWS(req, file);

      if (currentUser?.image?.key)
        await FileService.removeFileAWS(currentUser?.image?.key as string);
    }

    const image = res?.data ? res.data : currentUser?.image;
    let updateResult = await User.findByIdAndUpdate(id, {
      ...updateUserDto,
      image,
    });

    const imageUrl = image?.url;

    return {
      status: 200,
      message: "Update user successfully",
      data: { ...updateResult?.toObject(), imageUrl },
    };
  };

  static getList = async (
    filter: UserFilterDto,
    page: number,
    limit: number
  ) => {
    let { searchQuery, ...filterUser } = filter;

    const defaultLimit = limit ? limit : 10;
    const skip = ((page ? page : 1) - 1) * defaultLimit;

    const resultCount = (
      await User.find({
        username: new RegExp(searchQuery, "i"),
        ...filterUser,
      })
    ).length;
    const totalPages = Math.ceil(resultCount / defaultLimit);

    let res = await User.find({
      username: new RegExp(searchQuery, "i"),
      ...filterUser,
    })
      .skip(skip)
      .limit(defaultLimit);

    let userList = res.map((user) => {
      const imageUrl = user.image?.url;

      const { image, ...rest } = user.toObject();

      return {
        ...rest,
        imageUrl,
      };
    });

    return {
      status: 200,
      message: "Get user list successfully",
      data: {
        pageIndex: page ? page : 1,
        pageSize: defaultLimit,
        totalPages,
        resultCount,
        items: userList,
      },
    };
  };
}
