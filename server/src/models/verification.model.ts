import { IVerification, VerificationType } from "@/types/Verification";
import mongoose, { Schema, Types } from "mongoose";

const verificationTokenSchema = new Schema<IVerification>(
  {
    userId: {
      ref: "User",
      type: Types.ObjectId,
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    verificationType: {
      type: String,
      enum: Object.values(VerificationType),
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Verification = mongoose.model<IVerification>(
  "Verification-Token",
  verificationTokenSchema,
);
