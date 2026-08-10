import { Verification } from "@/models/verification.model";
import { IVerificationRepository } from "./verification.interface";
import { IVerificationToken, VerificationType } from "@/types/Verification";
import { Types } from "mongoose";

class VerificationRepository implements IVerificationRepository {
  async createToken(data: Partial<IVerificationToken>) {
    return await Verification.create(data);
  }

  async replace(data: Partial<IVerificationToken>) {
    return Verification.findOneAndUpdate(
      {
        userId: data.userId,
        verificationType: data.verificationType,
      },
      data,
      {
        upsert: true,
        returnDocument: "after",
      },
    );
  }

  async findByTokenHash(tokenHash: string) {
    return Verification.findOne({
      tokenHash,
    })
      .lean()
      .exec();
  }
  public async findByHashAndType(tokenHash: string, type: VerificationType) {
    return await Verification.findOne({
      tokenHash,
      verificationType: type,
    }).exec();
  }

  async deleteById(id: Types.ObjectId) {
    await Verification.findByIdAndDelete(id);
  }

  public async deleteByUserIdAndType(
    userId: Types.ObjectId,
    type: VerificationType,
  ) {
    await Verification.deleteMany({ userId, verificationType: type }).exec();
  }
}

export default VerificationRepository;
