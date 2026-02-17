import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  errorHandler,
  serverErrorHandler,
  successHandler,
} from "../utils/responseHandlers.js";
import { generateCookieAndSetToken } from "../utils/generateCookieAndToken.js";

export const signup = async (req, res) => {
  const { username, email, password, gender } = req.body;
  try {
    if (!username || !email || !password || !gender)
      return errorHandler(res, 400, "All fields are required");

    const existingUser = await User.findOne({ email });
    if (existingUser) return errorHandler(res, 400, "User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePic = `${process.env.PROFILE_PIC_API}/${gender}`;

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic,
      lastLogin: new Date(),
    });

    const token = generateCookieAndSetToken(user._id, res);
    return successHandler(res, 201, "User created successfully", user, token);
  } catch (error) {
    console.error("Error in SignUp Controller:", error.message);
    return serverErrorHandler(res, 500, "Internal Server Error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password)
      return errorHandler(res, 400, "All fields are required");

    const user = await User.findOne({ email });
    if (!user) return errorHandler(res, 404, "User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorHandler(res, 400, "Invalid email or password");

    user.lastLogin = new Date();
    await user.save();

    const token = generateCookieAndSetToken(user._id, res);
    return successHandler(res, 200, "Logged in successfully", user, token);
  } catch (error) {
    console.error("Error in Login Controller:", error.message);
    return serverErrorHandler(res, 500, "Internal Server Error");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      error: false,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Error in Logout Controller:", error.message);
    return serverErrorHandler(res, 500, "Internal Server Error");
  }
};
