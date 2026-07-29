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

  override toJSON() {
    return {
      ...super.toJSON(),
      errors: this.errors,
    };
  }
}

export const translateZodError = (error: unknown): Error => {
  if (error instanceof ZodError) {
    return new ValidationError(
      error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  return error instanceof Error ? error : new Error("Unknown validation error");
};

// export const handleZodError = (error: ZodError) => {
//   return new ValidationError(
//     error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
//   );
// };
