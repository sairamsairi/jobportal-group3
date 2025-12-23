import express from "express";
import {
  createOrUpdateProfile,
  getMyProfile,
  getProfileByUserId,
  deleteMyProfile
} from "../controllers/profileController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// @route   POST /api/v1/profile
// @desc    Create or update a user profile
// @access  Private
router.post("/", isAuthenticated, createOrUpdateProfile);

// @route   GET /api/v1/profile/me
// @desc    Get logged-in user's profile
// @access  Private
router.get("/me", isAuthenticated, getMyProfile);

// @route   GET /api/v1/profile/:userId
// @desc    Get profile by user ID
// @access  Public
router.get("/:userId", getProfileByUserId);

// @route   DELETE /api/v1/profile/me
// @desc    Delete profile of logged-in user
// @access  Private
router.delete("/me", isAuthenticated, deleteMyProfile);

export default router;

