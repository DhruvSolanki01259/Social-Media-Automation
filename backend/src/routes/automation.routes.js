import express from "express";
import { automationController } from "../controllers/automation.controllers.js";

const router = express.Router();

router.post("/autocomplete", automationController);

export default router;
