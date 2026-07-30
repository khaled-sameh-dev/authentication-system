// export  class AppError extends Error {
//   constructor(
//     message: string,
//     public readonly statusCode: number,
//     public readonly code: string,
//     public readonly details?: Record<string, unknown>,
//   ) {
//     super(message);

//     Error.captureStackTrace(this, this.constructor);
//   }

//   toJSON() {
//     return {
//       success: false,
//       message: this.message,
//       code: this.code,
//       ...(this.details && { details: this.details }),
//     };
//   }
// }

export abstract class AppError extends Error {
  public readonly isOperational: boolean;
  public abstract readonly statusCode: number;
  public abstract readonly errorCode: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    isOperational: boolean,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.isOperational = isOperational;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);

    this.isOperational = isOperational;

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
}

export class UnauthorizedError extends AppError {
  public readonly statusCode = 401;
  public readonly errorCode = "UNAUTHORIZED";
}

export class ForbiddenError extends AppError {
  public readonly statusCode = 403;
  public readonly errorCode = "FORBIDDEN";
}

export class NotFoundError extends AppError {
  public readonly statusCode = 404;
  public readonly errorCode = "NOT_FOUND";
}

export class ConflictError extends AppError {
  public readonly statusCode = 409;
  public readonly errorCode = "RESOURCE_CONFLICT";
}

export class ValidationError extends AppError {
  public readonly statusCode = 422;
  public readonly errorCode = "VALIDATIOM_ERROR";
}

export class InternalServerError extends AppError {
  public readonly statusCode = 500;
  public readonly errorCode = "INTERNAL_SERVER_ERROR";
}

export class ServiceUnavailableError extends AppError {
  public readonly statusCode = 503;
  public readonly errorCode = "SERVICE_UNAVAILABLE";
}
