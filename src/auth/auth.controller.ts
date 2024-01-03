import { Request, Response } from "express";
import { RegisterUserDto } from "./dto/register-user.dto";
import AuthService from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { IUser } from "../user/user.interface";

export default class AuthController {
  static async register(req: Request, res: Response) {
    let result = await AuthService.registerNewUser(req.body as RegisterUserDto);

    res.status(result.status).json(result);
  }

  static async login(req: Request, res: Response) {
    let result = await AuthService.loginUser(req.body as LoginUserDto, res);

    res.status(result.status).json(result);
  }

  static async logout(req: Request, res: Response) {
    let user: IUser = (req as any).user;
    let result = await AuthService.logoutUser(user, res);

    res.status(result.status).json(result);
  }
}
