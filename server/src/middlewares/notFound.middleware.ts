import { AppError } from "@/errors";
import { NextFunction, Response, Request } from "express";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    "ROUTE_NOT_FOUND",
  );
  next(error)
};

export default notFoundHandler