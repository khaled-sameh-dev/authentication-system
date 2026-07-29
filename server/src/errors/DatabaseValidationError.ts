import { AppError } from "./AppError";
import mongoose from "mongoose";
import { MongoServerError } from "mongodb";

import { DuplicateKeyError } from "@/errors/DuplicateKeyError";

export interface DatabaseValidationIssue {
  field: string;
  message: string;
}

export class DatabaseValidationError extends AppError {
  constructor(public readonly errors: DatabaseValidationIssue[]) {
    super("Validation failed", 400, "DATABASE_VALIDATION");
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

export const translateMongooseError = (error: unknown): Error => {
  if (error instanceof MongoServerError && error.code === 11000) {
    const field = Object.keys(error.keyPattern ?? {})[0] ?? "field";
    const value = error.keyValue?.[field];

    return new DuplicateKeyError(field, value);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return new DatabaseValidationError(
      Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      })),
    );
  }

  if (error instanceof mongoose.Error.CastError) {
    return new DatabaseValidationError([
      {
        field: error.path,
        message: "Invalid value",
      },
    ]);
  }

  return error as Error;
};
