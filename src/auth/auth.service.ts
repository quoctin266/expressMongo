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
import { sendMail } from "../util/mail.config";
import PassReset from "./schema/passReset.schema";
import moment from "moment";
require("dotenv").config();

const frontendDomain =
  process.env.NODE_ENV === "development"
    ? process.env.FRONTEND_DOMAIN_DEVELOPMENT
    : process.env.FRONTEND_DOMAIN_PRODUCTION;

export default class AuthService {
  static registerNewUser = async (registerUserDto: RegisterUserDto) => {
    const { email, password } = registerUserDto;

    let existUser = await User.findOne({ email }).exec();
    if (existUser) throw new AppError("Email already exist", 409);

    const hashPassword = await UserService.hashPassword(password);
    registerUserDto.password = hashPassword;
    let result = await User.create({ ...registerUserDto, status: 0 });

    await this.sendMailOtp(email);

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
          googleAuth: user.googleAuth,
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

    // res.cookie("refresh_token", refreshToken, {
    //   httpOnly: true,
    //   maxAge: ms(process.env.JWT_REFRESH_EXPIRE as string),
    // });

    const user = await User.findById(payload.id);
    const imageUrl = user?.image?.url;
    const description = user?.description;
    const biography = user?.biography;

    return {
      status: 200,
      message: "Login successfully",
      data: {
        accessToken,
        refreshToken,
        userCredentials: { ...payload, imageUrl, description, biography },
      },
    };
  };

  static googleAuth = async (googleAuthDto: GoogleAuthDto, res: Response) => {
    const { email, username, firstName, lastName, image } = googleAuthDto;

    let user = await User.findOne({ email }).exec();

    let payload: IUser = {
      id: "",
      username: "",
      email: "",
      role: 1,
      status: 1,
      dob: "",
      phone: "",
      address: "",
      googleAuth: true,
    };
    if (!user) {
      let result = await User.create({
        ...googleAuthDto,
        image: {
          url: image,
          key: image,
        },
        googleAuth: true,
        status: 1,
      });
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
      payload.role = user.role;
      payload.dob = user.dob?.toISOString();
      payload.phone = user.phone as string;
      payload.address = user.address as string;
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

    // res.cookie("refresh_token", refreshToken, {
    //   httpOnly: true,
    //   maxAge: ms(process.env.JWT_REFRESH_EXPIRE as string),
    // });

    const currentUser = await User.findById(payload.id);
    const imageUrl = currentUser?.image?.url;
    const description = currentUser?.description;
    const biography = currentUser?.biography;

    return {
      status: 200,
      message: "Login successfully",
      data: {
        accessToken,
        refreshToken,
        userCredentials: { ...payload, imageUrl, description, biography },
      },
    };
  };

  static logoutUser = async (user: IUser, res: Response) => {
    // res.clearCookie("refresh_token");
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

    // response.clearCookie("refresh_token");
    // response.cookie("refresh_token", newRefreshToken, {
    //   httpOnly: true,
    //   maxAge: ms(process.env.JWT_REFRESH_EXPIRE as string),
    // });

    const imageUrl = (await User.findById(payload.id))?.image?.url;
    const description = (await User.findById(payload.id))?.description;
    const biography = (await User.findById(payload.id))?.biography;

    return {
      status: 200,
      message: "Get new token successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        userCredentials: { ...payload, imageUrl, description, biography },
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

  static sendMailOtp = async (email: string) => {
    let user = await User.findOne({ email });
    let otp = Math.floor(Math.random() * 899999 + 100000);

    await User.findByIdAndUpdate(user?._id, { otp });

    let template = "otp.ejs";
    let subject = "Active your account";
    let context = {
      otp: otp,
      username: user?.username,
      redirectUrl: `${frontendDomain}/verify-account?userId=${user?._id}`,
    };

    await sendMail(template, context, email, subject);
  };

  static resendOtp = async (userId: string) => {
    let user = await User.findById(userId);
    let otp = Math.floor(Math.random() * 899999 + 100000);

    await User.findByIdAndUpdate(user?._id, { otp });

    let template = "otp.ejs";
    let subject = "Active your account";
    let context = {
      otp: otp,
      username: user?.username,
      redirectUrl: `${frontendDomain}/verify-account?userId=${user?._id}`,
    };

    await sendMail(template, context, user?.email as string, subject);
  };

  static checkOtp = async (userId: string, otp: number) => {
    let user = await User.findById(userId);

    if (user?.otp !== +otp) throw new AppError("Invalid otp", 401);

    await User.findByIdAndUpdate(userId, { status: 1 });

    return {
      status: 200,
      message: "Account verified",
      data: null,
    };
  };

  static forgetPassword = async (email: string) => {
    let user = await User.findOne({ email }).exec();
    if (!user) throw new AppError("Email not found", 404);

    let res = await PassReset.create({ userId: user._id });

    const backendDomain =
      process.env.NODE_ENV === "development"
        ? process.env.BACKEND_DOMAIN_DEVELOPMENT
        : process.env.BACKEND_DOMAIN_PRODUCTION;

    let template = "resetRequest.ejs";
    let subject = "Reset password";
    let context = {
      url: `${backendDomain}/api/v1/auth/verify-request?requestId=${res._id}`,
    };
    await sendMail(template, context, email, subject);

    return {
      status: 201,
      message: "Send request succesfully",
      data: null,
    };
  };

  static verifyRequest = async (requestId: string) => {
    let request = await PassReset.findById(requestId)
      .select("+createdAt")
      .exec();
    if (!request) return { status: 404 };

    let hours = moment().diff(moment(request?.createdAt), "hours");

    if (hours > 24) return { status: 400 };

    return {
      status: 200,
      userId: request.userId,
    };
  };
}
