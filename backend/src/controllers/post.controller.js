import Post from "../models/post.model.js";

// FETCH ALL POSTS
export const getAllPosts = async (req, res) => {
  try {
    const { hashtag, userId } = req.query;

    let filter = {};

    // filter by hashtag
    if (hashtag) {
      filter.hashtags = { $in: [hashtag] };
    }

    // filter by user
    if (userId) {
      filter.user = userId;
    }

    const posts = await Post.find(filter)
      .populate("user", "username email") // get user details without password
      .sort({ createdAt: -1 });

    res.status(200).json({ count: posts.length, posts });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { title, caption, hashtags, mediaUrl, mediaType } = req.body;

    if (!title || !mediaUrl || !mediaType) {
      return res
        .status(400)
        .json({ message: "Title, mediaUrl & mediaType are required" });
    }

    const post = await Post.create({
      title,
      caption,
      hashtags,
      mediaUrl,
      mediaType,
      user: req.user._id, // from protect middleware
    });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    let post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // only owner can update
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    const { title, caption, hashtags, mediaUrl, mediaType } = req.body;

    post.title = title || post.title;
    post.caption = caption || post.caption;
    post.hashtags = hashtags || post.hashtags;
    post.mediaUrl = mediaUrl || post.mediaUrl;
    post.mediaType = mediaType || post.mediaType;

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // only owner can delete
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
