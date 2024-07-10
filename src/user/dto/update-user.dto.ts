import { CreateUserDto } from "./create-user.dto";

export interface IMobileFile {
  data: string;

  mimetype: string;

  size: number;

  name: string;

  isMobile: boolean;
}

export class UpdateUserDto extends CreateUserDto {
  file: IMobileFile;

  expoPushToken?: String;
}
