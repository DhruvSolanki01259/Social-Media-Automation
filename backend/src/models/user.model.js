import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);