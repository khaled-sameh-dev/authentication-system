import { IVerificationToken, VerificationType } from "@/types/Verification";
import { Types } from "mongoose";

export interface IVerificationRepository {
  createToken(data: Partial<IVerificationToken>): Promise<IVerificationToken>;
  findByHashAndType(
    tokenHash: string,
    type: VerificationType,
  ): Promise<IVerificationToken | null>;
  deleteByUserIdAndType(
    userId: Types.ObjectId,
    type: VerificationType,
  ): Promise<void>;
  deleteById(id: Types.ObjectId): Promise<void>;
}
