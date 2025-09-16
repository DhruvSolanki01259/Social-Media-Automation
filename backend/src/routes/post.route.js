import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
} from "../controllers/post.controller.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
