import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    socialMedia: {
      type: [String],
      enum: ["facebook", "instagram", "twitter", "linkedin"],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one social media platform must be selected",
      },
    },
    category: {
      type: String,
      enum: [
        "Adventure",
        "Marketing",
        "Education",
        "Entertainment",
        "News",
        "Lifestyle",
        "Health & Fitness",
        "Food & Recipes",
        "Travel",
        "Technology",
        "Business",
        "Finance",
        "Fashion",
        "Beauty",
        "Gaming",
        "Sports",
        "Music",
        "Photography",
        "DIY & Crafts",
        "Motivation & Inspiration",
        "Science",
        "Politics",
        "Culture",
        "Memes",
        "Other",
      ],
      default: "Other",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    time: {
      type: String, // e.g., "14:30"
      default: "",
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    isPosted: {
      type: Boolean,
      default: false,
    },
    mediaUrls: [
      {
        type: String,
        default: "",
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
