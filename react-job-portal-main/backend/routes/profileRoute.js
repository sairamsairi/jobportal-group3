import express from "express";
import Profile from "../models/profileSchema.js";
import { isAuthenticated } from "../middlewares/auth.js"; // Your auth middleware

const router = express.Router();

// @route   POST /api/profile
// @desc    Create or update a user profile
// @access  Private
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const profileData = {
      user: req.user._id, // Comes from auth middleware 
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      education: req.body.education,
      experience: req.body.experience,
      skills: req.body.skills,
      cvUrl: req.body.cvUrl,
      portfolioLinks: req.body.portfolioLinks,
      about: req.body.about,
    };

    // Check if profile exists
    let profile = await Profile.findOne({ user: req.user._id });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileData },
        { new: true, upsert: true }
      );
      return res.json({ success: true, profile });
    }

    profile = new Profile(profileData);
    await profile.save();
    res.status(201).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/profile/me
// @desc    Get logged-in user's profile
// @access  Private
router.get("/me", isAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/profile/:userId
// @desc    Get profile by user ID
// @access  Public
router.get("/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/profile/me
// @desc    Delete profile of logged-in user
// @access  Private
router.delete("/me", isAuthenticated, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
