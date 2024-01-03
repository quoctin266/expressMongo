import User from "./schema/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt, { compare } from "bcryptjs";
import AppError from "../custom/AppError";

export default class UserService {
  static hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);

    return hashPassword;
  };

  static checkPassword = async (hash: string, password: string) => {
    return compare(password, hash);
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

  static updateToken = async (token: string, id: string) => {
    await User.findByIdAndUpdate(id, { resfreshToken: token });
  };
}
