import logger from "@/config/logger";
import { AppError } from "@/errors";
import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const isProduction = process.env.NODE_ENV === "production";

  if (error instanceof AppError) {
    logger.error(`Operational Error: ${error.message}`, {
      statusCode: error.statusCode,
      code: error.errorCode,
      path: req.path,
      method: req.method,
      stack: isProduction && error.stack,
    });

    res.status(error.statusCode).json({
      success: false,
      error: error.serializeErrors(),
    });
    return;
  }

  logger.error(`CRITICAL Error: ${error.message}`, {
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

export default globalErrorHandler