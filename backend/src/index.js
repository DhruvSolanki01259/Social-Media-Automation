import "./loadEnv.js"; 
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Clerk
import { clerkMiddleware } from "@clerk/express";

// Routes
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import emailRoutes from "./routes/email.routes.js";

import automationRoutes from "./routes/automation.routes.js";

// DB
import { connectDB } from "./database/connectDB.js";

const FRONTEND_URL = process.env.FRONTEND_URI || "http://localhost:5173";
const PORT = process.env.PORT || 8000;

const app = express();

// Middlewares
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.json());

app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});


app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/email", emailRoutes);

app.use("/api/openai", automationRoutes);

// Run App
app.listen(PORT, () => {
  console.log(`Server is Running on PORT: ${PORT}`);
  connectDB();
});