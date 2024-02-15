import { Request, Response } from "express";
import CommentService from "./comment.service";
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { UpdateCommentDTO } from "./dto/update-comment.dto";

export default class CommentController {
  static async getList(req: Request, res: Response) {
    let { player } = req.query;
    let result = await CommentService.getCommentsList(player as string);

    res.status(result.status).json(result);
  }

  //   static async getNation(req: Request, res: Response) {
  //     let result = await NationService.getNationDetail(req.params.id);

  //     res.status(result.status).json(result);
  //   }

  static async create(req: Request, res: Response) {
    let result = await CommentService.createComment(
      req.body as CreateCommentDTO
    );

    res.status(result.status).json(result);
  }

  static async update(req: Request, res: Response) {
    let result = await CommentService.updateComment(
      req.body as UpdateCommentDTO,
      req.params.id
    );

    res.status(result.status).json(result);
  }

  static async delete(req: Request, res: Response) {
    let result = await CommentService.deleteComment(req.params.id);

    res.status(result.status).json(result);
  }
}
