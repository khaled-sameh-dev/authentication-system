import { Verification } from "@/models/verification.model";
import { IVerificationRepository } from "./verification.interface";

class VerificationRepository implements IVerificationRepository {
  async create(data: Partial<IVerification>) {
    return Verification.create(data);
  }

  async replace(data: Partial<IVerification>) {
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
    });
  }

  async delete(id: string) {
    await Verification.findByIdAndDelete(id);
  }
}

export default VerificationRepository;
