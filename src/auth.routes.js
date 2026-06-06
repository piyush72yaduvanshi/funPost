import express from "express";
import { register, login,logout,changePassword,updateProfile,getProfile } from "./auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/change-password", changePassword);
router.put("/update-profile", updateProfile);
router.get("/get-profile", getProfile);

export default router;