import { UserModel } from "@/models/user.model";
import { IUserRepository, UserDocument } from "./user.interface";
import { IUser } from "@/types";
import { HydratedDocument, Types } from "mongoose";

class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return await UserModel.findOne({ email: email }).select("+password");
  }
  async findById(id: Types.ObjectId) {
    return await UserModel.findById(id);
  }
  async create(user: Partial<IUser>) {
    return await UserModel.create(user);
  }

  async verifyEmail(userId: Types.ObjectId) {
    return UserModel.findByIdAndUpdate(
      userId,
      {
        isEmailVerified: true,
      },
      {
        returnDocument: "after",
      },
    );
  }
}

export default UserRepository;
