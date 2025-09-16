// Routes
import authRoutes from "./routes/auth.route.js";

// Database

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

app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
