import { ObjectId } from "mongoose";

export interface IUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  phone?: string;
  address?: string;
  role: number;
}
