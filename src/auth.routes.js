import express from "express";
import { register, login,logout,changePassword,updateProfile,getProfile } from "./auth.controller.js";
import { isAuthenticated } from "./middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout",isAuthenticated, logout);
router.post("/change-password",isAuthenticated, changePassword);
router.put("/update-profile",isAuthenticated, updateProfile);
router.get("/get-profile",isAuthenticated, getProfile);

export default router;