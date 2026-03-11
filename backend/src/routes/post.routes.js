import express from "express";
import { protectRoute } from "../middlewares/requireAuth.js";

import {
  createPost,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controllers.js";

const router = express.Router();

router.post("/", protectRoute, createPost);

router.get("/", protectRoute, getUserPosts);

router.get("/:id", protectRoute, getPostById);

router.put("/:id", protectRoute, updatePost);

router.delete("/:id", protectRoute, deletePost);

export default router;