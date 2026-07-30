import { NextFunction, Response, Request } from "express";

export type asyncContrller = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const asyncHandler = (fn: asyncContrller) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
