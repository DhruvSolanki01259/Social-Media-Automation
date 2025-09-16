// Routes
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";

// Database
import { connect } from "./database/connect.js";

// Packages
import cookieParser from "cookie-parser";
import express from "express";
import "dotenv/config";

const PORT = process.env.PORT;
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
  connect();
});
