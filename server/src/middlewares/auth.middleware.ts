import { ForbiddenError, UnauthorizedError } from "@/errors";
import { SessionModel } from "@/models/session.mode";
import { UserRole } from "@/types";
import { verifyToken } from "@/utils/cryptoTokens";
import type { NextFunction, Response, Request } from "express";

export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new UnauthorizedError(
      "Access denied: Access Token is missing or in incorrect format",
      true,
      { reason: "ACCESS_TOKEN_MISSING" },
    );

  try {
    const [__, token] = authHeader?.split(" ");

    const verified = verifyToken(token.trim());

    if (verified.familyId) {
      const activeSession = await SessionModel.findOne({
        familyId: verified.familyId,
        revoked: false,
      }).lean();

      if (!activeSession) {
        throw new UnauthorizedError(
          "This session has been cancelled or you have been logged out, Please log in again.",
          true,
          { reason: "SESSION_REVOKED" },
        );
      }
    }

    req.user = verified;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Access Token expired", true, {
        reason: "TOKEN_EXPIRED",
      });
    }
    throw new UnauthorizedError("Invalid Access Token", true, {
      reason: "INVALID_TOKEN",
    });
  }
};

export const authorizeRoles = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) throw new UnauthorizedError("please Login first!");

    const userRole = allowedRoles.includes(req.user.role)!!;

    if (!userRole)
      throw new ForbiddenError(
        "User not authorized to access this route",
        true,
        {
          reason: "UNAUTHORIZED",
        },
      );

    next();
  };
};

export const requireEmailVerified = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) throw new UnauthorizedError("please Login first!");

  if (!req.user.isVerified)
    throw new ForbiddenError(
      "User have to verify email to access this route",
      true,
      {
        reason: "EMAIL_NOT_VERIFIED",
      },
    );

  next();
};
