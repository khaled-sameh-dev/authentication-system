import express from "express";

import authRouter from "./auth.route";
import oAuthRouter from "./oauth.routes";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/oauth", oAuthRouter);

export default router;
