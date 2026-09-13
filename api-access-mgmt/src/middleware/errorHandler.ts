import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const authErrorStatus =
    typeof err === "object" && err !== null
      ? ((): number | undefined => {
          const maybeStatus = (err as { status?: unknown; statusCode?: unknown }).status;
          const maybeStatusCode = (err as { status?: unknown; statusCode?: unknown }).statusCode;

          if (typeof maybeStatus === "number") {
            return maybeStatus;
          }

          if (typeof maybeStatusCode === "number") {
            return maybeStatusCode;
          }

          return undefined;
        })()
      : undefined;

  if (authErrorStatus === 401) {
    req.log?.warn({ statusCode: 401 }, "Authentication failed");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (authErrorStatus === 403) {
    req.log?.warn({ statusCode: 403 }, "Authentication failed");
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      details: err.flatten()
    });
    return;
  }

  res.status(500).json({
    message: "Internal Server Error"
  });
}
