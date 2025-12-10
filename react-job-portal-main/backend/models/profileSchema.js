
// models/Profile.js
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
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
    cvUrl: { type: String }, // Can store file link from cloud storage
    portfolioLinks: [String],
    about: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
