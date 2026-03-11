import User from "../models/user.model.js";

export const syncUser = async (req, res) => {
  try {
    // console.log("SYNC USER ROUTE HIT");

    if (!req.auth?.userId) {
      console.log("No Clerk auth found");
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { userId, sessionClaims } = req.auth;

    // console.log("Clerk User ID:", userId);

    const email =
      sessionClaims?.email ||
      sessionClaims?.email_address ||
      sessionClaims?.primary_email_address;

    const username =
      sessionClaims?.username ||
      sessionClaims?.preferred_username ||
      "user";

    const profileImage =
      sessionClaims?.image_url ||
      sessionClaims?.picture ||
      "";

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // console.log("Creating new user in MongoDB");

      user = await User.create({
        clerkId: userId,
        email,
        username,
        profileImage,
      });
    } else {
      console.log("User already exists");
    }

    // console.log("User sync successful");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("SYNC USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};