import { Router } from "express";
import { router as characterRouter } from "./character";

export const router = Router();
router.use("/character/", characterRouter);
