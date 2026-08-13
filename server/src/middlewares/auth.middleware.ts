import { AppError, ForbiddenError, UnauthorizedError } from "@/errors";
import { SessionModel } from "@/models/session.model";
import { UserRole } from "@/types";
import { verifyToken } from "@/utils/cryptoTokens";
import type { NextFunction, Response, Request } from "express";

export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError(
      "Access denied: Access Token is missing or improperly formatted.",
      { reason: "ACCESS_TOKEN_MISSING" },
    );
  }

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
          "This session has been revoked or you have been logged out. Please log in again.",
          { reason: "SESSION_REVOKED" },
        );
      }
    }

    req.user = verified;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(
        new UnauthorizedError("Access Token has expired.", {
          reason: "TOKEN_EXPIRED",
        }),
      );
    }

    if (error instanceof AppError) {
      return next(error);
    }

    return next(
      new UnauthorizedError("Invalid Access Token.", {
        reason: "INVALID_TOKEN",
      }),
    );
  }
};

export const authorizeRoles = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      throw new UnauthorizedError(
        "Authentication required. Please log in first.",
      );

    const hasPermission = allowedRoles.includes(req.user.role);

    if (!hasPermission) {
      throw new ForbiddenError(
        "Access denied: You do not have permission to access this resource.",
        { reason: "INSUFFICIENT_PERMISSIONS" },
      );
    }

    next();
  };
};

export const requireEmailVerified = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user)
    throw new UnauthorizedError(
      "Authentication required. Please log in first.",
    );

  if (!req.user.isVerified) {
    throw new ForbiddenError(
      "Access denied: Email verification is required to access this resource.",
      { reason: "EMAIL_NOT_VERIFIED" },
    );
  }

  next();
};
