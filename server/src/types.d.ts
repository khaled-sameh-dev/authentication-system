declare interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
declare interface IVerification {
  id: string;
  userId: mongoose.Types.ObjectId;
  verificationType: VerificationType;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}


declare interface SendEmailPayload {
  to: string;
  subject: string;
  html: string;
}
