import AppError from "../../custom/AppError";
import FileService from "../../file/file.service";
import Comment from "../comment/schema/comment.schema";
import { CreatePlayerDTO } from "./dto/create-player.dto";
import { UpdatePlayerDTO } from "./dto/update-player.dto";
import Player from "./schema/player.schema";
require("dotenv").config();

export default class PlayerService {
  static getPlayersList = async (name: string) => {
    let result = await Player.find({
      name: new RegExp(name, "i"),
      isDeleted: false,
    })
      .populate("nation")
      .exec();

    let playerList = await Promise.all(
      result.map(async (player) => {
        const imageUrl = FileService.createFileLink(player.img as string);
        const comments = await Comment.find({ player: player.id }).populate(
          "author",
          "username"
        );

        const { img, ...rest } = player.toObject();

        return {
          ...rest,
          imageUrl,
          comments,
        };
      })
    );

    return {
      status: 200,
      message: "Get players list successfully",
      data: playerList,
    };
  };

  static createNewPlayer = async (createPlayerDto: CreatePlayerDTO) => {
    const { name } = createPlayerDto;

    let existPlayer = await Player.findOne({ name }).exec();
    if (existPlayer) throw new AppError("Player already exist", 409);

    let result = await Player.create({ ...createPlayerDto });

    return {
      status: 201,
      message: "Create new player successfully",
      data: result,
    };
  };

  static getPlayerDetail = async (id: string) => {
    let player = await Player.findById(id).exec();
    if (!player) throw new AppError("Player not found", 404);

    const imageUrl = FileService.createFileLink(player.img as string);

    return {
      status: 200,
      message: "Get player detail successfully",
      data: { ...player.toObject(), imageUrl },
    };
  };

  static deletePlayer = async (id: string) => {
    let player = await Player.findById(id).exec();
    if (!player) throw new AppError("Player not found", 404);

    await FileService.removeFile(player.img as string);
    let result = await Player.findByIdAndUpdate(id, { isDeleted: true });

    return {
      status: 200,
      message: "Delete player successfully",
      data: result,
    };
  };

  static updatePlayer = async (
    id: string,
    updatePlayerDto: UpdatePlayerDTO
  ) => {
    let player = await Player.findById(id).exec();
    if (!player) throw new AppError("Player not found", 404);

    // remove old image if user has new image for player
    if (updatePlayerDto.img) await FileService.removeFile(player.img as string);
    let result = await Player.findByIdAndUpdate(id, { ...updatePlayerDto });

    return {
      status: 200,
      message: "Update player successfully",
      data: result,
    };
  };
}
