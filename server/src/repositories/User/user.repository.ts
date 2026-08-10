import { UserModel } from "@/models/user.model";
import { IUserRepository, UserDocument } from "./user.interface";
import { IUser, OAuthProvider } from "@/types";
import { Types } from "mongoose";

class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return await UserModel.findOne({ email }).select("+password");
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
      { isEmailVerified: true },
      { new: true }, // ملحوظة: returnDocument: "after" ده syntax الـ native driver
      // — مع Mongoose الصح هو { new: true }. الاتنين بيشتغلوا فعليًا
      // (Mongoose بتعمل map)، لكن { new: true } هي الموثقة رسميًا في Mongoose docs.
    );
  }

  async update(userId: Types.ObjectId, updateData: Partial<IUser>) {
    return await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData }, // كان باج: { $set: { updateData } } كان بيحط
      { new: true, runValidators: true },
    ).exec();
  }



  async findByOAuthId(provider: OAuthProvider, providerId: string) {
    return await UserModel.findOne({
      oauthAccounts: {
        $elemMatch: { provider, providerId },
      },
    });
  }

  async linkOAuthAccount(
    userId: Types.ObjectId,
    account: { provider: OAuthProvider; providerId: string },
  ) {
    return await UserModel.findByIdAndUpdate(
      userId,

      { $addToSet: { oauthAccounts: account } },
      { new: true },
    );
  }
}

export default UserRepository;
