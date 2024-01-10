import { Response } from "express";
import AppError from "../custom/AppError";
import { createJWT, verifyJWT } from "../middleware/jwt.service";
import User from "../user/schema/user.schema";
import { IUser } from "../user/user.interface";
import UserService from "../user/user.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import ms from "ms";
import { GoogleAuthDto } from "./dto/google-auth.dto";
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
          firstName: user.firstName as string,
          lastName: user.lastName as string,
          email: user.email as string,
          role: user.role,
          status: user.status,
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

  static googleAuth = async (googleAuthDto: GoogleAuthDto, res: Response) => {
    const { email, username, firstName, lastName } = googleAuthDto;

    let user = await User.findOne({ email }).exec();

    let payload: IUser = {
      id: "",
      username: "",
      email: "",
      role: 1,
      status: 1,
    };
    if (!user) {
      let result = await User.create({ ...googleAuthDto });
      payload.id = result.id;
      payload.email = email;
      payload.username = username;
      payload.firstName = firstName;
      payload.lastName = lastName;
    } else {
      payload.id = user.id;
      payload.email = user.email as string;
      payload.username = user.username as string;
      payload.firstName = user.firstName as string;
      payload.lastName = user.lastName as string;
    }

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

  static processNewToken = async (refreshToken: string, response: Response) => {
    let payload = verifyJWT(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN as string
    );
    if (!payload) throw new AppError("Invalid refresh token", 400);

    const newAccessToken = createJWT(
      payload,
      process.env.JWT_ACCESS_TOKEN as string,
      process.env.JWT_ACCESS_EXPIRE as string
    );

    // update new refresh token for user
    const newRefreshToken = createJWT(
      payload,
      process.env.JWT_REFRESH_TOKEN as string,
      process.env.JWT_REFRESH_EXPIRE as string
    );
    if (newRefreshToken)
      await UserService.updateToken(newRefreshToken, payload.id);

    response.clearCookie("refresh_token");
    response.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      maxAge: ms(process.env.JWT_REFRESH_EXPIRE as string),
    });

    return {
      status: 200,
      message: "Get new token successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        userCredentials: payload,
      },
    };
  };

  static verifyPassword = async (id: string, password: string) => {
    let user = await User.findById(id).select("+password").exec();
    if (user) {
      const checkPW = await UserService.checkPassword(
        user.password as string,
        password
      );
      if (!checkPW) throw new AppError("Incorrect password", 401);
    }

    return {
      status: 200,
      message: "Pasword verified",
      data: null,
    };
  };

  static changePassword = async (
    id: string,
    newPassword: string,
    confirmPW: string
  ) => {
    if (newPassword !== confirmPW)
      throw new AppError("Passwords do not match", 400);

    const hashPassword = await UserService.hashPassword(newPassword);
    let res = await User.findByIdAndUpdate(id, { password: hashPassword });

    return {
      status: 200,
      message: "Update password succesfully",
      data: res,
    };
  };
}
