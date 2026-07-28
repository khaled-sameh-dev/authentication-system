import env from "@/config/env";
import logger from "@/config/logger";
import { AppError } from "@/errors";
import { NextFunction, Response, Request } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method,
  });

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Mongoose validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(error.errors).map((e) => e.message),
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "production" ? "Internal Server Error" : error.message,
  });
};

export default globalErrorHandler;
