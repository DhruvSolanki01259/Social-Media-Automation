import express from "express";
import { syncUser } from "../controllers/user.controllers.js";
import { protectRoute } from "../middlewares/requireAuth.js";

const router = express.Router();

router.get("/me", protectRoute, syncUser);

export default router;