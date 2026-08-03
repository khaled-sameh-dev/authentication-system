import { NextFunction, Request, Response } from "express";
import logger from "@/config/logger";
import {
  AppError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "@/errors";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isProduction = process.env.NODE_ENV === "production";
  let error = err;

  // 1️⃣ تحويل أخطاء Mongoose الشائعة إلى AppError
  if (error.name === "CastError") {
    error = new BadRequestError("Invalid ID format");
  } else if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyValue || {})[0];
    error = new ConflictError(
      field ? `Duplicate value for field: ${field}` : "Duplicate resource",
    );
  }

  // 2️⃣ تحويل أخطاء JWT إلى AppError
  if (error.name === "JsonWebTokenError") {
    error = new UnauthorizedError("Invalid token format");
  } else if (error.name === "TokenExpiredError") {
    error = new UnauthorizedError("Token has expired, please login again");
  }

  // 3️⃣ التعامل مع Operational Errors (AppError)
  if (error instanceof AppError) {
    logger.error(`[${error.errorCode}] ${error.message}`, {
      statusCode: error.statusCode,
      path: req.path,
      method: req.method,
      details: error.details,
      ...(!isProduction && { stack: error.stack }),
    });

    res.status(error.statusCode).json({
      success: false,
      error: error.serializeErrors(),
    });
    return;
  }

  // 4️⃣ التعامل مع Critical / Unhandled Errors (خطأ سيرفر غير متوقع)
  logger.error(`CRITICAL UNHANDLED ERROR: ${error.message}`, {
    statusCode: 500,
    code: error.name,
    path: req.path,
    method: req.method,
    stack: error.stack,
  });

  res.status(500).json({
    success: false,
    error: {
      message: isProduction
        ? "Internal Server Error. Please try again later."
        : error.message,
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};

export default globalErrorHandler;
