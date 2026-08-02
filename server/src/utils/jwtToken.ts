import env from "@/config/env";
import jwt, { SignOptions } from "jsonwebtoken";

import crypto from "crypto";
import { Types } from "mongoose";

const options: SignOptions = {
  expiresIn: (env.JWT_EXPIRES_IN ?? "15m") as SignOptions["expiresIn"],
};

export const generateAccessToken = ({
  userId,
  email,
}: {
  userId: Types.ObjectId;
  email: string;
}) => {
  return jwt.sign({ userId, email }, env.JWT_SECRET!, options);
};

export const generateRefreshToken = () =>
  crypto.randomBytes(40).toString("hex");
