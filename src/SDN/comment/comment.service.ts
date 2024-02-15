import AppError from "../../custom/AppError";
import { CreateCommentDTO } from "./dto/create-comment.dto";
import { UpdateCommentDTO } from "./dto/update-comment.dto";
import Comment from "./schema/comment.schema";

export default class CommentService {
  static getCommentsList = async (player: string) => {
    let result = await Comment.find({ isDeleted: false, player }).populate(
      "author",
      "username"
    );

    return {
      status: 200,
      message: "Fetch comments list successfully",
      data: result,
    };
  };

  //   static getNationDetail = async (id: string) => {
  //     let nation = await Nation.findById(id).exec();
  //     if (!nation) throw new AppError("Nation not found", 404);

  //     return {
  //       status: 200,
  //       message: "Get nation detail successfully",
  //       data: nation,
  //     };
  //   };

  static createComment = async (createCommentDto: CreateCommentDTO) => {
    const { player, author } = createCommentDto;

    let exist = await Comment.exists({
      author,
      player,
      isDeleted: false,
    }).exec();
    if (exist) throw new AppError("Can only comment once", 409);

    let result = await Comment.create({ ...createCommentDto });

    return {
      status: 201,
      message: "Create comment successfully",
      data: result,
    };
  };

  static updateComment = async (
    updateCommentDto: UpdateCommentDTO,
    id: string
  ) => {
    let comment = await Comment.findById(id).exec();
    if (!comment) throw new AppError("Comment not found", 404);

    let result = await Comment.findByIdAndUpdate(id, {
      ...updateCommentDto,
    });

    return {
      status: 200,
      message: "Update comment successfully",
      data: result,
    };
  };

  static deleteComment = async (id: string) => {
    let comment = await Comment.findById(id).exec();
    if (!comment) throw new AppError("Comment not found", 404);

    let result = await Comment.findByIdAndUpdate(id, { isDeleted: true });

    return {
      status: 200,
      message: "Delete comment successfully",
      data: result,
    };
  };
}
