import env from "@/config/env";
import logger from "@/config/logger";
import { AppError } from "@/errors";

import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    logger.warn({
      message: error.message,
      code: error.code,
      method: req.method,
      path: req.originalUrl,
    });

    return res.status(error.statusCode).json(error.toJSON());
  }

  logger.error({
    message: error.message,
    method: req.method,
    path: req.originalUrl,

    ...(env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });

  return res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production" ? "Internal Server Error" : error.message,
  });
};

export default globalErrorHandler;
