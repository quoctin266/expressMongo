import User from "./schema/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt, { compare } from "bcryptjs";
import AppError from "../custom/AppError";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserFilterDto } from "./dto/user-filter.dto";

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
    let res = await User.findById(id);

    return {
      status: 200,
      message: "Get user detail successfully",
      data: res,
    };
  };

  static updateUser = async (id: string, updateUserDto: UpdateUserDto) => {
    let res = await User.findByIdAndUpdate(id, { ...updateUserDto });

    return {
      status: 200,
      message: "Update user successfully",
      data: res,
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

    return {
      status: 200,
      message: "Get user list successfully",
      data: {
        pageIndex: page ? page : 1,
        pageSize: defaultLimit,
        totalPages,
        resultCount,
        items: res,
      },
    };
  };
}
