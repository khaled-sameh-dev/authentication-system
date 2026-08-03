import { Types } from "mongoose";
import { JwtPayload } from "./types/User";

export interface JwtPayload {
  userId: Types.ObjectId;
  role: UserRole;
  isVerified: boolean;
  familyId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
