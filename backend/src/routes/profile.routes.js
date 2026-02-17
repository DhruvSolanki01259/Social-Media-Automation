import express from "express";
import {
  getProfile,
  updateProfile,
  addOrUpdateSocials,
  deleteSocials,
} from "../controllers/profile.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateProfile);

router.put("/socials", verifyToken, addOrUpdateSocials);
router.delete("/socials", verifyToken, deleteSocials);

export default router;
