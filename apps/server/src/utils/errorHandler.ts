import { Request, Response, NextFunction } from "express";
import { AppError } from "@/errors/AppError";
import { logger } from "@/config";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  let err = error;

  if (error instanceof AppError) {
    logger.warn({
      message: error.message,
      path: req.path
    });

    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  logger.error({
    message: error.message,
    stack: error.stack
  });

  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};
