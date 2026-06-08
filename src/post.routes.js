import express from "express";
import { isAuthenticated } from "./middleware.js";
import { createPost, getPosts, deletePost, updatePost,getById } from "./post.controller.js";

const router = express.Router();

router.post("/create-post", isAuthenticated, createPost);
router.get("/get-posts", isAuthenticated, getPosts);
router.delete("/delete-post/:id", isAuthenticated, deletePost);
router.put("/update-post/:id", isAuthenticated, updatePost);
router.get("/get-post/:id", isAuthenticated, getById);

export default router;