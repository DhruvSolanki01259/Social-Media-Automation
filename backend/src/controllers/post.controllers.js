// import Post from "../models/post.model.js";
// import User from "../models/user.model.js";
// import cloudinary from "cloudinary";
// import fs from "fs";

// // Configure Cloudinary
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ CREATE POST
// export const createPost = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       tags,
//       socialMedia,
//       isScheduled,
//       scheduledAt,
//       category,
//     } = req.body;
//     const userId = req.user._id;

//     if (!title || !description || !socialMedia?.length) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Upload media files to Cloudinary
//     let mediaUrls = [];
//     if (req.files?.length) {
//       for (const file of req.files) {
//         const result = await cloudinary.v2.uploader.upload(file.path, {
//           resource_type: file.mimetype.startsWith("video") ? "video" : "image",
//         });
//         mediaUrls.push(result.secure_url);

//         // Remove temp file after upload
//         fs.unlinkSync(file.path);
//       }
//     }

//     const newPost = await Post.create({
//       user: userId,
//       title,
//       description,
//       tags: tags ? JSON.parse(tags) : [], // in case tags come as JSON string
//       socialMedia: socialMedia ? JSON.parse(socialMedia) : [],
//       category: category || "Other",
//       isScheduled: isScheduled === "true" || isScheduled === true,
//       scheduledAt: isScheduled ? scheduledAt : null,
//       isPosted: !(isScheduled === "true" || isScheduled === true),
//       mediaUrls,
//     });

//     // Update user's post references
//     await User.findByIdAndUpdate(userId, {
//       $push: isScheduled
//         ? { scheduledPosts: newPost._id }
//         : { uploadedPosts: newPost._id },
//     });

//     res.status(201).json({
//       message: "Post created successfully",
//       post: newPost,
//     });
//   } catch (error) {
//     console.error("Create Post Error:", error);
//     res.status(500).json({ message: "Server error creating post" });
//   }
// };

// // ✅ GET ALL POSTS
// export const getAllPosts = async (req, res) => {
//   try {
//     const posts = await Post.find({ user: req.user._id }).sort({
//       createdAt: -1,
//     });
//     res.status(200).json(posts);
//   } catch (error) {
//     console.error("Get Posts Error:", error);
//     res.status(500).json({ message: "Server error fetching posts" });
//   }
// };

// // ✅ GET SINGLE POST
// export const getPostById = async (req, res) => {
//   try {
//     const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
//     if (!post) return res.status(404).json({ message: "Post not found" });
//     res.status(200).json(post);
//   } catch (error) {
//     console.error("Get Post Error:", error);
//     res.status(500).json({ message: "Server error fetching post" });
//   }
// };

// // ✅ UPDATE POST
// export const updatePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = { ...req.body };

//     // Parse JSON fields if coming from form-data
//     if (updatedData.tags) updatedData.tags = JSON.parse(updatedData.tags);
//     if (updatedData.socialMedia)
//       updatedData.socialMedia = JSON.parse(updatedData.socialMedia);

//     // Upload new media files to Cloudinary if provided
//     if (req.files?.length) {
//       const mediaUrls = [];
//       for (const file of req.files) {
//         const result = await cloudinary.v2.uploader.upload(file.path, {
//           resource_type: file.mimetype.startsWith("video") ? "video" : "image",
//         });
//         mediaUrls.push(result.secure_url);
//         fs.unlinkSync(file.path);
//       }
//       updatedData.mediaUrls = mediaUrls;
//     }

//     const post = await Post.findOneAndUpdate(
//       { _id: id, user: req.user._id },
//       updatedData,
//       { new: true }
//     );

//     if (!post)
//       return res
//         .status(404)
//         .json({ message: "Post not found or not authorized" });

//     res.status(200).json({
//       message: "Post updated successfully",
//       post,
//     });
//   } catch (error) {
//     console.error("Update Post Error:", error);
//     res.status(500).json({ message: "Server error updating post" });
//   }
// };

// // ✅ DELETE POST
// export const deletePost = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const post = await Post.findOneAndDelete({ _id: id, user: req.user._id });

//     if (!post)
//       return res
//         .status(404)
//         .json({ message: "Post not found or not authorized" });

//     // Remove reference from user
//     await User.findByIdAndUpdate(req.user._id, {
//       $pull: {
//         uploadedPosts: id,
//         scheduledPosts: id,
//       },
//     });

//     res.status(200).json({ message: "Post deleted successfully" });
//   } catch (error) {
//     console.error("Delete Post Error:", error);
//     res.status(500).json({ message: "Server error deleting post" });
//   }
// };

import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// ✅ CREATE POST (No file upload)
export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      tags,
      socialMedia,
      isScheduled,
      scheduledAt,
      category,
    } = req.body;

    const userId = req.user._id;

    // Basic validation
    if (!title || !description || !socialMedia) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Fix: handle cases where frontend sends plain strings (not JSON)
    let parsedTags = [];
    let parsedSocialMedia = [];

    try {
      parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags || [];
    } catch {
      parsedTags = tags ? tags.split(",").map((t) => t.trim()) : [];
    }

    try {
      parsedSocialMedia =
        typeof socialMedia === "string"
          ? JSON.parse(socialMedia)
          : socialMedia || [];
    } catch {
      parsedSocialMedia = socialMedia
        ? socialMedia.split(",").map((s) => s.trim())
        : [];
    }

    const newPost = await Post.create({
      user: userId,
      title,
      description,
      tags: parsedTags,
      socialMedia: parsedSocialMedia,
      category: category || "Other",
      isScheduled: isScheduled === "true" || isScheduled === true,
      scheduledAt: isScheduled ? scheduledAt : null,
      isPosted: !(isScheduled === "true" || isScheduled === true),
      mediaUrls: [], // No file uploads for now
    });

    // Update user's post references
    await User.findByIdAndUpdate(userId, {
      $push: isScheduled
        ? { scheduledPosts: newPost._id }
        : { uploadedPosts: newPost._id },
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Server error creating post" });
  }
};

// ✅ GET ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Get Posts Error:", error);
    res.status(500).json({ message: "Server error fetching posts" });
  }
};

// ✅ GET SINGLE POST
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (error) {
    console.error("Get Post Error:", error);
    res.status(500).json({ message: "Server error fetching post" });
  }
};

// ✅ UPDATE POST (simplified)
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (updatedData.tags) {
      try {
        updatedData.tags =
          typeof updatedData.tags === "string"
            ? JSON.parse(updatedData.tags)
            : updatedData.tags;
      } catch {
        updatedData.tags = updatedData.tags.split(",").map((t) => t.trim());
      }
    }

    if (updatedData.socialMedia) {
      try {
        updatedData.socialMedia =
          typeof updatedData.socialMedia === "string"
            ? JSON.parse(updatedData.socialMedia)
            : updatedData.socialMedia;
      } catch {
        updatedData.socialMedia = updatedData.socialMedia
          .split(",")
          .map((s) => s.trim());
      }
    }

    const post = await Post.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updatedData,
      { new: true }
    );

    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found or not authorized" });

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error("Update Post Error:", error);
    res.status(500).json({ message: "Server error updating post" });
  }
};

// ✅ DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOneAndDelete({ _id: id, user: req.user._id });

    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found or not authorized" });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { uploadedPosts: id, scheduledPosts: id },
    });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    res.status(500).json({ message: "Server error deleting post" });
  }
};
