import express from "express";
import { isAuthenticated } from "./middleware.js";
import { createPost } from "./post.controller.js";

const router = express.Router();

router.post("/create-post", isAuthenticated, createPost);

export default router;