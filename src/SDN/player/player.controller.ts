import { Request, Response } from "express";
import PlayerService from "./player.service";
import { CreatePlayerDTO } from "./dto/create-player.dto";
import { UpdatePlayerDTO } from "./dto/update-player.dto";

export default class PlayerController {
  static async create(req: Request, res: Response) {
    let result = await PlayerService.createNewPlayer(
      req.body as CreatePlayerDTO
    );

    res.status(result.status).json(result);
  }

  static async getList(req: Request, res: Response) {
    let result = await PlayerService.getPlayersList();

    res.status(result.status).json(result);
  }

  static async getDetail(req: Request, res: Response) {
    let result = await PlayerService.getPlayerDetail(req.params.id);

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    let result = await PlayerService.deletePlayer(req.params.id);

    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    let result = await PlayerService.updatePlayer(
      req.params.id,
      req.body as UpdatePlayerDTO
    );

    res.status(result.status).json(result);
  }
}
