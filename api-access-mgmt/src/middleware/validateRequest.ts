import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodTypeAny } from "zod";
import { ApiError } from "../utils/ApiError";

type ValidationTarget = "body" | "query" | "params";

export function validateRequest(
	schema: ZodTypeAny,
	target: ValidationTarget = "body"
): RequestHandler {
	return (req: Request, _res: Response, next: NextFunction): void => {
		const result = schema.safeParse(req[target]);

		if (!result.success) {
			next(new ApiError(400, "Validation failed", result.error.flatten()));
			return;
		}

		req[target] = result.data;
		next();
	};
}
