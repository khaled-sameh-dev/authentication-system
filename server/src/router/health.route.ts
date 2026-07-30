import { healthService } from "@/services/Health/health.service";
import { Router, Request, Response } from "express";


const healthRouter = Router();

/**
 * @route   GET /healthz/live
 * @desc    Liveness Probe - ترجع 200 طالما السيرفر لم ينهار
 */
healthRouter.get("/live", (_req: Request, res: Response) => {
  const liveness = healthService.getLiveness();
  res.status(200).json(liveness);
});

/**
 * @route   GET /healthz/ready
 * @desc    Readiness Probe - ترجع 200 لو السيرفر والداتابيز جاهزين، و 503 لو في مشكلة أو السيرفر بيفصل
 */
healthRouter.get("/ready", async (_req: Request, res: Response) => {
  const { isReady, details } = await healthService.getReadiness();

  if (!isReady) {
    res.status(503).json(details);
    return;
  }

  res.status(200).json(details);
});

export default healthRouter;
