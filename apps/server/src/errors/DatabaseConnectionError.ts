import { AppError } from "./AppError";

export class DatabaseConnectionError extends AppError {
  constructor(
    message = "Failed to connect to the database",
    public readonly cause?: unknown
  ) {
    super(message, 500);
    this.name = "DatabaseConnectionError";
  }
}
