import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import upload from "../middlewares/handleFiles.js";

const router = express.Router();

// All routes are protected
router.post("/", verifyToken, upload.array("mediaFiles"), createPost);
router.get("/", verifyToken, getAllPosts);
router.get("/:id", verifyToken, getPostById);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
