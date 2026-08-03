import { healthService } from "@/services/Health/health.service";
import { Router, Request, Response } from "express";


const healthRouter = Router();

healthRouter.get("/live", (_req: Request, res: Response) => {
  const liveness = healthService.getLiveness();
  res.status(200).json(liveness);
});

healthRouter.get("/ready", async (_req: Request, res: Response) => {
  const { isReady, details } = await healthService.getReadiness();

  if (!isReady) {
    res.status(503).json(details);
    return;
  }

  res.status(200).json(details);
});

export default healthRouter;
