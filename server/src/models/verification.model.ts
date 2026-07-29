import mongoose, { Schema } from "mongoose";

export enum VerificationType {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
  CHANGE_EMAIL = "CHANGE_EMAIL",
}


const verificationTokenSchema = new Schema<IVerification>(
  {
    id: {
      type: String,
      unique: true,
      default: () => crypto.randomUUID(),
      index: true,
    },
    userId: {
      ref: "users",
      type: String,
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
  "verification-tokens",
  verificationTokenSchema,
);
