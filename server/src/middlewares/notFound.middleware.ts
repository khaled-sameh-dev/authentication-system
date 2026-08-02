import { AppError, ForbiddenError } from "@/errors";
import { NextFunction, Response, Request } from "express";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ForbiddenError(
    `Route ${req.originalUrl} not found`,
    false,
    {
      reason: "ROUTE_NOT_FOUND",
      code: 404,
    },
  );
  next(error);
};

export default notFoundHandler;
