import { Request, Response } from "express";
import NationService from "./nation.service";
import { CreateNationDTO } from "./dto/create-nation.dto";

export default class NationController {
  static async getList(req: Request, res: Response) {
    let result = await NationService.gatNationsList();

    res.status(result.status).json(result);
  }

  static async getNation(req: Request, res: Response) {
    let result = await NationService.getNationDetail(req.params.id);

    res.status(result.status).json(result);
  }

  static async create(req: Request, res: Response) {
    let result = await NationService.createNewNation(
      req.body as CreateNationDTO
    );

    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    let result = await NationService.updateNation(
      req.body as CreateNationDTO,
      req.params.id
    );

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    let result = await NationService.deleteNation(req.params.id);

    res.status(result.status).json(result);
  }
}
