import { NextFunction, Response, Request } from "express";
import { ZodError, ZodSchema } from "zod";

import { ValidationError } from "@/errors";

export const validateBody =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatedErrors = error.issues.map((e) => ({
          field: e.path.join(""),
          message: e.message,
        }));
        throw new ValidationError("Validation Error", {
          errors: formatedErrors,
        });
      }
      next(error);
    }
  };
