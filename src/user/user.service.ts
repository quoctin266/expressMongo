import Customer from "./schema/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

export default class UserService {
  static createNewUser = async (createUserDto: CreateUserDto) => {
    await Customer.create({ ...createUserDto });

    return {
      status: 200,
      message: "ok",
      data: "ok",
    };
  };
}
