import express from "express";
import { isAuthenticated } from "./middleware.js";
import { createLike, deleteLike } from "./like.controller.js";

const router = express.Router();

router.post("/create-like/:id", isAuthenticated, createLike);
router.delete("/delete-like/:id", isAuthenticated, deleteLike);

export default router;