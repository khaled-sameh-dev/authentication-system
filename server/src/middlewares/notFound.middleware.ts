import { NotFoundError } from "@/errors";
import { NextFunction, Request, Response } from "express";

const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`, {
    reason: "ROUTE_NOT_FOUND",
  });

  return next(error);
};

export default notFoundHandler;
