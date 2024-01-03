import { Response } from "express";
import AppError from "../custom/AppError";
import { createJWT } from "../middleware/jwt.service";
import User from "../user/schema/user.schema";
import { IUser } from "../user/user.interface";
import UserService from "../user/user.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import ms from "ms";
require("dotenv").config();

export default class AuthService {
  static registerNewUser = async (registerUserDto: RegisterUserDto) => {
    const { email, password } = registerUserDto;

    let existUser = await User.findOne({ email }).exec();
    if (existUser) throw new AppError("Email already exist", 409);

    const hashPassword = await UserService.hashPassword(password);
    registerUserDto.password = hashPassword;
    let result = await User.create({ ...registerUserDto });

    return {
      status: 200,
      message: "Register successfully",
      data: result,
    };
  };

  static validateUser = async (email: string, password: string) => {
    let user = await User.findOne({ email }).select("+password").exec();
    if (user) {
      const checkPW = await UserService.checkPassword(
        user.password as string,
        password
      );
      if (checkPW === true) {
        const result: IUser = {
          id: user.id,
          username: user.username as string,
          firstName: user.firstname as string,
          lastName: user.lastname as string,
          email: user.email as string,
          role: user.role,
          dob: user.dob?.toISOString() as string,
          phone: user.phone as string,
          address: user.address as string,
        };
        return result;
      }
    }
    return null;
  };

  static loginUser = async (loginUserDto: LoginUserDto, res: Response) => {
    const { email, password } = loginUserDto;
    const payload = await this.validateUser(email, password);

    if (!payload) throw new AppError("Invalid email or password", 401);

    const accessToken = createJWT(
      payload,
      process.env.JWT_ACCESS_TOKEN as string,
      process.env.JWT_ACCESS_EXPIRE as string
    );

    // update new refresh token for user
    const refreshToken = createJWT(
      payload,
      process.env.JWT_REFRESH_TOKEN as string,
      process.env.JWT_REFRESH_EXPIRE as string
    );
    if (refreshToken) await UserService.updateToken(refreshToken, payload.id);

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: ms(process.env.JWT_REFRESH_EXPIRE as string),
    });

    return {
      status: 200,
      message: "Login successfully",
      data: {
        accessToken,
        refreshToken,
        userCredentials: payload,
      },
    };
  };

  static logoutUser = async (user: IUser, res: Response) => {
    res.clearCookie("refresh_token");
    await UserService.updateToken("", user.id);

    return {
      status: 200,
      message: "Logout successfully",
      data: null,
    };
  };
}
