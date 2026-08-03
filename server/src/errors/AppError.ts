export abstract class AppError extends Error {
  public readonly isOperational: boolean;
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    isOperational: boolean = true,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.isOperational = isOperational;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public serializeErrors(): {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  } {
    return {
      message: this.message,
      code: this.errorCode,
      ...(this.details && { details: this.details }),
    };
  }
}

export class BadRequestError extends AppError {
  public readonly statusCode = 400;
  public readonly errorCode = "BAD_REQUEST";

  constructor(
    message: string = "Bad Request",
    details?: Record<string, unknown>,
  ) {
    super(message, true, details);
  }
}

export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = "UNAUTHORIZED";

  constructor(
    message: string = "Unauthorized Access",
    details?: Record<string, unknown>,
  ) {
    super(message, true, details);
  }
}

export class ForbiddenError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = "FORBIDDEN";

  constructor(
    message: string = "Forbidden",
    details?: Record<string, unknown>,
  ) {
    super(message, true, details);
  }
}

export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = "NOT_FOUND";

  constructor(
    message: string = "Resource Not Found",
    details?: Record<string, unknown>,
  ) {
    super(message, true, details);
  }
}

export class ConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = "RESOURCE_CONFLICT";

  constructor(
    message: string = "Resource Conflict",
    details?: Record<string, unknown>,
  ) {
    super(message, true, details);
  }
}

export class ValidationError extends AppError {
  public readonly statusCode = 422;
  public readonly errorCode = "VALIDATION_ERROR";

  constructor(
    message: string = "Validation Error",
    details?: Record<string, unknown>,
  ) {
    super(message, true, details);
  }
}

export class InternalServerError extends AppError {
  public readonly statusCode = 500;
  public readonly errorCode = "INTERNAL_SERVER_ERROR";

  constructor(
    message: string = "Internal Server Error",
    details?: Record<string, unknown>,
  ) {
    super(message, false, details); // isOperational = false لأنها خطأ سيرفر
  }
}

export class ServiceUnavailableError extends AppError {
  public readonly statusCode = 503;
  public readonly errorCode = "SERVICE_UNAVAILABLE";

  constructor(
    message: string = "Service Unavailable",
    details?: Record<string, unknown>,
  ) {
    super(message, true, details);
  }
}
