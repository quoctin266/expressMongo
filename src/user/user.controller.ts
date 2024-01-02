import { Request, Response } from "express";
import UserService from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

export default class UserController {
  static async create(req: Request, res: Response) {
    let result = await UserService.createNewUser(req.body as CreateUserDto);

    res.status(result.status).json(result);
  }
}
