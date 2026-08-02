import { Types } from "mongoose";
import { JwtPayload } from "./types/User";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

declare interface JwtPayload {
  userId: Types.ObjectId;
  role: UserRole;
  isVerified: boolean;
  familyId: string;
}
