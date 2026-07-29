import { translateZodError } from "@/errors/ValidationError";
import { NextFunction, Response, Request } from "express";
import { ZodSchema } from "zod";

export const validateBody =
  (schema: ZodSchema) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(translateZodError(error));
    }
  };
