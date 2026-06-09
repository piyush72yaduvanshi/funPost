import express from "express";
import { isAuthenticated } from "./middleware.js";
import { createComment, deleteComment, updatedComment } from "./comment.controller.js";

const router = express.Router();

router.post("/create-comment", isAuthenticated, createComment);
router.delete("/delete-comment/:id", isAuthenticated, deleteComment);
router.put("/update-comment/:id", isAuthenticated, updatedComment);

export default router;