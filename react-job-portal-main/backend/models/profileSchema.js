// models/Profile.js
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    userRole: {
      type: String,
      required: true,
      enum: ["Job Seeker", "Employer"],
    },

    // Common fields for both roles
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    about: {
      type: String,
    },

    // Job Seeker specific fields
    education: [
      {
        institution: { type: String },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startYear: { type: Number },
        endYear: { type: Number },
      },
    ],
    experience: [
      {
        company: { type: String },
        role: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    skills: [String],
    resume: {
      public_id: { type: String },
      url: { type: String },
    },
    portfolioLinks: [String],

    // Employer specific fields
    companyName: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+", ""],
    },
    industry: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    companyLogo: {
      public_id: { type: String },
      url: { type: String },
    },
    contactPerson: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    contactPhone: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
