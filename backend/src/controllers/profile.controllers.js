import User from "../models/user.model.js";

// GET user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

// UPDATE profile (username, bio, location, website)
export const updateProfile = async (req, res) => {
  try {
    const { username, bio, location, website } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      { username, bio, location, website },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

// CRUD Socials
export const addOrUpdateSocials = async (req, res) => {
  try {
    const { linkedin, instagram, facebook, twitter } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user,
      { socials: { linkedin, instagram, facebook, twitter } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Social details updated", user });
  } catch (error) {
    console.error("Error updating socials:", error);
    res.status(500).json({ message: "Server error while updating socials" });
  }
};

// DELETE socials (clear them)
export const deleteSocials = async (req, res) => {
  try {
    const { platform } = req.body; // e.g., "linkedin", "instagram", "facebook", "twitter"

    // Validate input
    const validPlatforms = ["linkedin", "instagram", "facebook", "twitter"];
    if (!platform || !validPlatforms.includes(platform)) {
      return res.status(400).json({
        message:
          "Please specify a valid platform: linkedin, instagram, facebook, or twitter",
      });
    }

    // Build dynamic update object
    const updateField = {};
    updateField[`socials.${platform}`] = "";

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updateField },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `${platform} link removed successfully`,
      user,
    });
  } catch (error) {
    console.error("Error deleting social:", error);
    res.status(500).json({
      message: "Server error while deleting social link",
    });
  }
};
