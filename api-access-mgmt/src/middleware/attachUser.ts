import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export function attachUser(req: Request, _res: Response, next: NextFunction): void {
  const auth0UserId = req.auth?.payload.sub;

  if (!auth0UserId || typeof auth0UserId !== "string") {
    next(new ApiError(401, "Unauthorized"));
    return;
  }

  req.user = { auth0UserId };
  next();
}
