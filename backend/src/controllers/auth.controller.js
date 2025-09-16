import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = (req, res) => {
  const { username, email, password } = req.body;
};

export const login = (req, res) => {};

export const logout = (req, res) => {};
