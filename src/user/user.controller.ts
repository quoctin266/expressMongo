import { Request, Response } from "express";
import UserService from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserFilterDto } from "./dto/user-filter.dto";

export default class UserController {
  static async create(req: Request, res: Response) {
    let result = await UserService.createNewUser(req.body as CreateUserDto);

    res.status(result.status).json(result);
  }

  static async getDetail(req: Request, res: Response) {
    const { id } = req.params;
    let result = await UserService.getDetail(id);

    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    let result = await UserService.updateUser(
      id,
      req.body as UpdateUserDto,
      req
    );

    res.status(result.status).json(result);
  }

  static async getUsersList(req: Request, res: Response) {
    const {
      pageIndex,
      pageSize,
      ...filter
    }: { pageIndex: number; pageSize: number } = req.query as any;
    let result = await UserService.getList(
      filter as UserFilterDto,
      +pageIndex,
      +pageSize
    );

    res.status(result.status).json(result);
  }
}
