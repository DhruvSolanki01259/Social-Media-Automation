import jwt from "jsonwebtoken";

export const generateCookieAndSetToken = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return token;
  } catch (error) {
    console.log("Error is Setting Token and Cookie:", error.message);
    return;
  }
};
