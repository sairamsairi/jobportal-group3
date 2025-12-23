import Profile from "../models/profileSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from "cloudinary";

// @desc    Create or update user profile
// @route   POST /api/v1/profile
// @access  Private
export const createOrUpdateProfile = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Build profile data based on user role
    const profileData = {
        user: userId,
        userRole: userRole,
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,
        about: req.body.about,
    };

    // Add role-specific fields
    if (userRole === "Job Seeker") {
        profileData.education = req.body.education ? JSON.parse(req.body.education) : [];
        profileData.experience = req.body.experience ? JSON.parse(req.body.experience) : [];
        profileData.skills = req.body.skills ? JSON.parse(req.body.skills) : [];
        profileData.portfolioLinks = req.body.portfolioLinks ? JSON.parse(req.body.portfolioLinks) : [];

        // Handle resume upload
        if (req.files && req.files.resume) {
            const { resume } = req.files;

            // Delete old resume if exists
            const existingProfile = await Profile.findOne({ user: userId });
            if (existingProfile && existingProfile.resume && existingProfile.resume.public_id) {
                await cloudinary.v2.uploader.destroy(existingProfile.resume.public_id);
            }

            // Upload new resume
            const allowedFormats = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (!allowedFormats.includes(resume.mimetype)) {
                return next(new ErrorHandler("Invalid file type. Please upload PDF or DOC file.", 400));
            }

            const cloudinaryResponse = await cloudinary.v2.uploader.upload(
                resume.tempFilePath,
                {
                    folder: "job_portal_resumes",
                    resource_type: "auto",
                }
            );

            if (!cloudinaryResponse || cloudinaryResponse.error) {
                console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
                return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
            }

            profileData.resume = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            };
        }
    } else if (userRole === "Employer") {
        profileData.companyName = req.body.companyName;
        profileData.companyWebsite = req.body.companyWebsite;
        profileData.companySize = req.body.companySize;
        profileData.industry = req.body.industry;
        profileData.companyDescription = req.body.companyDescription;
        profileData.contactPerson = req.body.contactPerson;
        profileData.contactEmail = req.body.contactEmail;
        profileData.contactPhone = req.body.contactPhone;

        // Handle company logo upload
        if (req.files && req.files.companyLogo) {
            const { companyLogo } = req.files;

            // Delete old logo if exists
            const existingProfile = await Profile.findOne({ user: userId });
            if (existingProfile && existingProfile.companyLogo && existingProfile.companyLogo.public_id) {
                await cloudinary.v2.uploader.destroy(existingProfile.companyLogo.public_id);
            }

            // Upload new logo
            const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
            if (!allowedFormats.includes(companyLogo.mimetype)) {
                return next(new ErrorHandler("Invalid file type. Please upload an image file.", 400));
            }

            const cloudinaryResponse = await cloudinary.v2.uploader.upload(
                companyLogo.tempFilePath,
                {
                    folder: "job_portal_company_logos",
                }
            );

            if (!cloudinaryResponse || cloudinaryResponse.error) {
                console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
                return next(new ErrorHandler("Failed to upload company logo to Cloudinary", 500));
            }

            profileData.companyLogo = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            };
        }
    }

    // Check if profile exists and update or create
    let profile = await Profile.findOne({ user: userId });

    if (profile) {
        // Update existing profile
        profile = await Profile.findOneAndUpdate(
            { user: userId },
            { $set: profileData },
            { new: true, runValidators: true }
        );
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile,
        });
    } else {
        // Create new profile
        profile = await Profile.create(profileData);
        return res.status(201).json({
            success: true,
            message: "Profile created successfully",
            profile,
        });
    }
});

// @desc    Get logged-in user's profile
// @route   GET /api/v1/profile/me
// @access  Private
export const getMyProfile = catchAsyncErrors(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.user._id }).populate("user", "name email role");

    if (!profile) {
        return next(new ErrorHandler("Profile not found", 404));
    }

    res.status(200).json({
        success: true,
        profile,
    });
});

// @desc    Get profile by user ID
// @route   GET /api/v1/profile/:userId
// @access  Public
export const getProfileByUserId = catchAsyncErrors(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.params.userId }).populate("user", "name email role");

    if (!profile) {
        return next(new ErrorHandler("Profile not found", 404));
    }

    res.status(200).json({
        success: true,
        profile,
    });
});

// @desc    Delete logged-in user's profile
// @route   DELETE /api/v1/profile/me
// @access  Private
export const deleteMyProfile = catchAsyncErrors(async (req, res, next) => {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
        return next(new ErrorHandler("Profile not found", 404));
    }

    // Delete resume from cloudinary if exists
    if (profile.resume && profile.resume.public_id) {
        await cloudinary.v2.uploader.destroy(profile.resume.public_id);
    }

    // Delete company logo from cloudinary if exists
    if (profile.companyLogo && profile.companyLogo.public_id) {
        await cloudinary.v2.uploader.destroy(profile.companyLogo.public_id);
    }

    await Profile.findOneAndDelete({ user: req.user._id });

    res.status(200).json({
        success: true,
        message: "Profile deleted successfully",
    });
});
