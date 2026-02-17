import { connectDB } from "./database/connectDB.js";

import cookieParser from "cookie-parser";

import express from "express";
import cors from "cors";
import "dotenv/config";

// Routes
import postRoutes from "./routes/post.routes.js";
import automationRoutes from "./routes/automation.routes.js";

const FRONTEND_URL = process.env.FRONTEND_URI || "http://localhost:5173";
const PORT = process.env.PORT || 8000;
const app = express();

// Middlewares
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/posts", postRoutes);
app.use("/api/openai", automationRoutes);

// Run App
app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
  connectDB();
});
