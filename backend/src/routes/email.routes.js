import express from "express";
import { sendContactEmail } from "../controllers/email.controllers.js";

const router = express.Router();

router.post("/contact", sendContactEmail);

export default router;