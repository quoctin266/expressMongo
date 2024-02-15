import AppError from "../../custom/AppError";
import { CreateNationDTO } from "./dto/create-nation.dto";
import { UpdateNationDTO } from "./dto/update-nation.dto";
import Nation from "./schema/nation.schema";

export default class NationService {
  static gatNationsList = async () => {
    let result = await Nation.find({ isDeleted: false });

    return {
      status: 200,
      message: "Fetch nations list successfully",
      data: result,
    };
  };

  static getNationDetail = async (id: string) => {
    let nation = await Nation.findById(id).exec();
    if (!nation) throw new AppError("Nation not found", 404);

    return {
      status: 200,
      message: "Get nation detail successfully",
      data: nation,
    };
  };

  static createNewNation = async (createNationDto: CreateNationDTO) => {
    const { name } = createNationDto;

    let nation = await Nation.findOne({ name }).exec();
    if (nation) throw new AppError("Nation already exist", 409);

    let result = await Nation.create({ ...createNationDto });

    return {
      status: 200,
      message: "Create new nation successfully",
      data: result,
    };
  };

  static updateNation = async (
    updateNationDto: UpdateNationDTO,
    id: string
  ) => {
    let nation = await Nation.findById(id).exec();
    if (!nation) throw new AppError("Nation not found", 404);

    let result = await Nation.findByIdAndUpdate(id, {
      ...updateNationDto,
    }).select(["+updatedAt", "-name", "-description"]);

    return {
      status: 200,
      message: "Update nation successfully",
      data: result,
    };
  };

  static deleteNation = async (id: string) => {
    let nation = await Nation.findById(id).exec();
    if (!nation) throw new AppError("Nation not found", 404);

    let result = await Nation.findByIdAndUpdate(id, { isDeleted: true });

    return {
      status: 200,
      message: "Delete nation successfully",
      data: result,
    };
  };
}
