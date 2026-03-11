import Post from "../models/post.model.js";


// CREATE POST
export const createPost = async (req, res) => {
  try {
    // console.log("POST ROUTE HIT");

    const { userId } = req.auth();

    // console.log("User ID:", userId);
    // console.log("Body:", req.body);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const post = await Post.create({
      clerkUserId: userId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("CREATE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL POSTS OF USER
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.auth();

    const posts = await Post.find({ clerkUserId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET SINGLE POST
export const getPostById = async (req, res) => {
  try {
    const { userId } = req.auth();

    const post = await Post.findOne({
      _id: req.params.id,
      clerkUserId,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE POST
export const updatePost = async (req, res) => {
  try {
    const { userId } = req.auth();

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, clerkUserId },
      req.body,
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { userId } = req.auth();

    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      clerkUserId,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};