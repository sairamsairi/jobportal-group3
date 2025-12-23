import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
    minLength: [3, "Title must contain at least 3 Characters!"],
    maxLength: [100, "Title cannot exceed 100 Characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide description."],
    minLength: [30, "Description must contain at least 30 Characters!"],
    maxLength: [2000, "Description cannot exceed 2000 Characters!"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
  },
  country: {
    type: String,
    required: [true, "Please provide a country name."],
  },
  city: {
    type: String,
    required: [true, "Please provide a city name."],
  },
  location: {
    type: String,
    required: [true, "Please provide location."],
    minLength: [10, "Location must contain at least 10 characters!"],
  },

  // Salary Information
  fixedSalary: {
    type: Number,
    min: [1000, "Salary must be at least 1000"],
    max: [999999999, "Salary cannot exceed 999999999"],
  },
  salaryFrom: {
    type: Number,
    min: [1000, "Salary must be at least 1000"],
    max: [999999999, "Salary cannot exceed 999999999"],
  },
  salaryTo: {
    type: Number,
    min: [1000, "Salary must be at least 1000"],
    max: [999999999, "Salary cannot exceed 999999999"],
  },
  salaryCurrency: {
    type: String,
    default: "USD",
  },

  // Advanced Fields
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Contract", "Internship", "Temporary", ""],
    default: "",
  },
  experienceLevel: {
    type: String,
    enum: ["Entry Level", "Mid Level", "Senior Level", "Executive", "Internship", ""],
    default: "",
  },
  requiredSkills: {
    type: [String],
    default: [],
  },
  responsibilities: {
    type: String,
    maxLength: [1500, "Responsibilities cannot exceed 1500 Characters!"],
  },
  requirements: {
    type: String,
    maxLength: [1500, "Requirements cannot exceed 1500 Characters!"],
  },
  benefits: {
    type: [String],
    default: [],
  },
  applicationDeadline: {
    type: Date,
  },
  isRemote: {
    type: Boolean,
    default: false,
  },
  numberOfPositions: {
    type: Number,
    default: 1,
    min: [1, "Number of positions must be at least 1"],
  },

  // Status Fields
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

export const Job = mongoose.model("Job", jobSchema);
