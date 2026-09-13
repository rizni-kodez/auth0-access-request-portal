import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import {
  accessRequestIdParamSchema,
  accessRequestQuerySchema,
  createAccessRequestSchema,
  updateAccessRequestSchema
} from "../models/accessRequest.model";
import {
  createAccessRequest,
  deleteAccessRequest,
  listAccessRequests,
  updateAccessRequest
} from "../services/accessRequest.service";
import { checkJwt } from "../middleware/checkJwt";
import { attachUser } from "../middleware/attachUser";
import { validateRequest } from "../middleware/validateRequest";
import { ApiError } from "../utils/ApiError";

const router = Router();

router.use(checkJwt, attachUser);

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}

router.get(
  "/",
  validateRequest(accessRequestQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const auth0UserId = req.user?.auth0UserId;

    if (!auth0UserId) {
      throw new ApiError(401, "Unauthorized");
    }

    const requests = await listAccessRequests(auth0UserId, req.query);
    res.json(requests);
  })
);

router.post(
  "/",
  validateRequest(createAccessRequestSchema, "body"),
  asyncHandler(async (req, res) => {
    const auth0UserId = req.user?.auth0UserId;

    if (!auth0UserId) {
      throw new ApiError(401, "Unauthorized");
    }

    const createdRequest = await createAccessRequest(auth0UserId, req.body);
    res.status(201).json(createdRequest);
  })
);

router.patch(
  "/:id",
  validateRequest(accessRequestIdParamSchema, "params"),
  validateRequest(updateAccessRequestSchema, "body"),
  asyncHandler(async (req, res) => {
    const auth0UserId = req.user?.auth0UserId;

    if (!auth0UserId) {
      throw new ApiError(401, "Unauthorized");
    }

    const updatedRequest = await updateAccessRequest(req.params.id, auth0UserId, req.body);
    res.json(updatedRequest);
  })
);

router.delete(
  "/:id",
  validateRequest(accessRequestIdParamSchema, "params"),
  asyncHandler(async (req, res) => {
    const auth0UserId = req.user?.auth0UserId;

    if (!auth0UserId) {
      throw new ApiError(401, "Unauthorized");
    }

    await deleteAccessRequest(req.params.id, auth0UserId);
    res.json({ message: "Access request deleted successfully" });
  })
);

router.all("*", (_req, res) => {
  res.status(405).json({ message: "Method not allowed on /api/access-requests" });
});

export default router;
