import { Request, Response } from "express";
import { RegisterUserDto } from "./dto/register-user.dto";
import AuthService from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { IUser } from "../user/user.interface";
import { GoogleAuthDto } from "./dto/google-auth.dto";

export default class AuthController {
  static async register(req: Request, res: Response) {
    let result = await AuthService.registerNewUser(req.body as RegisterUserDto);

    res.status(result.status).json(result);
  }

  static async login(req: Request, res: Response) {
    let result = await AuthService.loginUser(req.body as LoginUserDto, res);

    res.status(result.status).json(result);
  }

  static async googleAuth(req: Request, res: Response) {
    let result = await AuthService.googleAuth(req.body as GoogleAuthDto, res);

    res.status(result.status).json(result);
  }

  static async logout(req: Request, res: Response) {
    let user: IUser = (req as any).user;
    let result = await AuthService.logoutUser(user, res);

    res.status(result.status).json(result);
  }

  static async getNewToken(req: Request, res: Response) {
    let refreshToken: string = req.cookies["refresh_token"];
    let result = await AuthService.processNewToken(refreshToken, res);

    res.status(result.status).json(result);
  }

  static async verifyPW(req: Request, res: Response) {
    const {
      userId,
      currentPassword,
    }: { userId: string; currentPassword: string } = req.body;
    let result = await AuthService.verifyPassword(userId, currentPassword);

    res.status(result.status).json(result);
  }

  static async changePW(req: Request, res: Response) {
    const {
      userId,
      newPassword,
      confirmNewPassword,
    }: { userId: string; newPassword: string; confirmNewPassword: string } =
      req.body;
    let result = await AuthService.changePassword(
      userId,
      newPassword,
      confirmNewPassword
    );

    res.status(result.status).json(result);
  }

  static async checkOtp(req: Request, res: Response) {
    const { userId } = req.params;
    const { otp } = req.body;

    let result = await AuthService.checkOtp(userId, otp as number);

    res.status(result.status).json(result);
  }
}
