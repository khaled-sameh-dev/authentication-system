import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "@/errors";

const handleValidationError = (error: unknown, next: NextFunction): void => {
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return next(
      new ValidationError("Invalid request body or query parameters.", {
        errors: formattedErrors,
      }),
    );
  }
  return next(error);
};

export const validateBody =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      return handleValidationError(error, next);
    }
  };

export const validateQuery =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as any;
      return next();
    } catch (error) {
      return handleValidationError(error, next);
    }
  };

export const validateParams =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.params = (await schema.parseAsync(req.params)) as any;
      return next();
    } catch (error) {
      return handleValidationError(error, next);
    }
  };
