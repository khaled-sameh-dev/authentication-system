import { AppError } from "./AppError";

export class DatabaseConnectionError extends AppError {
  constructor(message: string = "Unable to connect to MongoDB") {
    super(message, 503, "DATABASE_CONNECTION_ERROR");
    this.name = "DatabaseConnectionError";
  }
}
