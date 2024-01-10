import { Request, Response } from "express";
import CategoryService from "./category.service";

export default class CategoryController {
  static async create(req: Request, res: Response) {
    const { name }: { name: string } = req.body;
    let result = await CategoryService.create(name);

    res.status(result.status).json(result);
  }

  static async getList(req: Request, res: Response) {
    let result = await CategoryService.getList();

    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = <{ name: string }>req.body;
    let result = await CategoryService.update(id, name);

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    let result = await CategoryService.delete(id);

    res.status(result.status).json(result);
  }

  static async getDetail(req: Request, res: Response) {
    const { id } = req.params;
    let result = await CategoryService.getDetail(id);

    res.status(result.status).json(result);
  }
}
