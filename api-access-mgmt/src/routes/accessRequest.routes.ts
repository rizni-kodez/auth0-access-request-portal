import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.status(501).json({ message: "Not implemented in checkpoint 1" });
});

export default router;
