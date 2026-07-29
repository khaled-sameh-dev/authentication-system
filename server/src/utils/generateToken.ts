import crypto from "crypto";

export const generateToken = (expiresInMinutes: number) => {
  const token: string = crypto.randomBytes(32).toString("hex");

  const expiresIn = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return { token, expiresIn };
};

export const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

export const compareTokens = (plain: string, hashedPlain: string): boolean =>
  hashToken(plain) === hashedPlain;
