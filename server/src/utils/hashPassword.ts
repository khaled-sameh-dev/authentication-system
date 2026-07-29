import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = 12;

export const hashPassword = async (pass: string): Promise<string> => {
  return bcrypt.hash(pass, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateRandomToken = (length = 32): string => {
  return crypto.randomBytes(length).toString("hex");
};
