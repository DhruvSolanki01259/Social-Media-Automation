import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
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

    isScheduled: {
      type: Boolean,
      default: false,
    },

    scheduledAt: {
      type: {
        type: String,
        enum: ["auto", "manual"],
        default: "auto",
      },
      date: {
        type: Date,
        default: null,
      },
      time: {
        type: String,
        default: null,
      },
    },

    mediaUrls: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;