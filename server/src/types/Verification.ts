import mongoose from "mongoose";

export enum VerificationType {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
  CHANGE_EMAIL = "CHANGE_EMAIL",
}

export interface IVerification {
  userId: mongoose.Types.ObjectId;
  verificationType: VerificationType;
  tokenHash: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
}
