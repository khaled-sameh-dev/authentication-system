import { AppError } from "./AppError";
import { ZodError } from "zod";

export interface ValidationIssue {
  field: string;
  message: string;
}

export class ValidationError extends AppError {
  public readonly errors: ValidationIssue[];

  constructor(errors: ValidationIssue[]) {
    super("Validation failed", 400, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export const handleZodError = (error: ZodError) => {
  return new ValidationError(
    error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
  );
};
