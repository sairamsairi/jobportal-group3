import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import "./PostJob.css";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    country: "",
    city: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    isRemote: false,
    numberOfPositions: 1,
    salaryCurrency: "USD",
    applicationDeadline: "",
    responsibilities: "",
    requirements: "",
  });

  const [salaryType, setSalaryType] = useState("default");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");

  const [requiredSkills, setRequiredSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [benefits, setBenefits] = useState([]);
  const [benefitInput, setBenefitInput] = useState("");

  const [loading, setLoading] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setRequiredSkills(requiredSkills.filter(skill => skill !== skillToRemove));
  };

  const addBenefit = () => {
    if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput("");
    }
  };

  const removeBenefit = (benefitToRemove) => {
    setBenefits(benefits.filter(benefit => benefit !== benefitToRemove));
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Build job data
      const jobData = {
        ...formData,
        requiredSkills,
        benefits,
      };

      // Add salary based on type
      if (salaryType === "Fixed Salary") {
        jobData.fixedSalary = fixedSalary;
      } else if (salaryType === "Ranged Salary") {
        jobData.salaryFrom = salaryFrom;
        jobData.salaryTo = salaryTo;
      }

      const response = await axios.post(
        "http://localhost:4000/api/v1/job/post",
        jobData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Job posted successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        country: "",
        city: "",
        location: "",
        jobType: "",
        experienceLevel: "",
        isRemote: false,
        numberOfPositions: 1,
        salaryCurrency: "USD",
        applicationDeadline: "",
        responsibilities: "",
        requirements: "",
      });
      setSalaryType("default");
      setFixedSalary("");
      setSalaryFrom("");
      setSalaryTo("");
      setRequiredSkills([]);
      setBenefits([]);

      // Navigate to my jobs
      setTimeout(() => {
        navigateTo("/job/me");
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Graphics & Design",
    "Mobile App Development",
    "Frontend Web Development",
    "Backend Web Development",
    "Full Stack Development",
    "MERN Stack Development",
    "MEAN Stack Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "DevOps",
    "Cloud Computing",
    "Cybersecurity",
    "Business Development",
    "Account & Finance",
    "Marketing & Sales",
    "Video Animation",
    "Content Writing",
    "Data Entry",
    "Customer Support",
    "Human Resources",
    "Project Management",
  ];

  const currencies = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "CNY"];

  return (
    <div className="post-job-page">
      <div className="post-job-container">
        <div className="post-job-header">
          <h1>Post a New Job</h1>
          <p>Fill in the details to attract the best candidates</p>
        </div>

        <form className="post-job-form" onSubmit={handleJobPost}>
          {/* Basic Information */}
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
                required
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Job Type *</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Job Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Experience Level *</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Experience Level</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Executive">Executive</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="form-group">
                <label>Number of Positions</label>
                <input
                  type="number"
                  name="numberOfPositions"
                  value={formData.numberOfPositions}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Provide a detailed description of the job role..."
                required
              />
              <span className="char-count">{formData.description.length}/2000</span>
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h2>Location</h2>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isRemote"
                  checked={formData.isRemote}
                  onChange={handleChange}
                />
                <span>Remote Position</span>
              </label>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., United States"
                  required
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., New York"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Full Address/Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., 123 Main St, New York, NY 10001"
                required
              />
            </div>
          </div>

          {/* Salary */}
          <div className="form-section">
            <h2>Compensation</h2>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Salary Type *</label>
                <select
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                  required
                >
                  <option value="default">Select Salary Type</option>
                  <option value="Fixed Salary">Fixed Salary</option>
                  <option value="Ranged Salary">Salary Range</option>
                </select>
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select
                  name="salaryCurrency"
                  value={formData.salaryCurrency}
                  onChange={handleChange}
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {salaryType === "Fixed Salary" && (
              <div className="form-group">
                <label>Fixed Salary *</label>
                <input
                  type="number"
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                  placeholder="e.g., 75000"
                  required
                />
              </div>
            )}

            {salaryType === "Ranged Salary" && (
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Salary From *</label>
                  <input
                    type="number"
                    value={salaryFrom}
                    onChange={(e) => setSalaryFrom(e.target.value)}
                    placeholder="e.g., 60000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Salary To *</label>
                  <input
                    type="number"
                    value={salaryTo}
                    onChange={(e) => setSalaryTo(e.target.value)}
                    placeholder="e.g., 90000"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Skills & Requirements */}
          <div className="form-section">
            <h2>Skills & Requirements</h2>

            <div className="form-group">
              <label>Required Skills</label>
              <div className="input-with-button">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a required skill (e.g., React, Node.js)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <button type="button" onClick={addSkill} className="btn-add-inline">
                  Add
                </button>
              </div>
              <div className="tags-container">
                {requiredSkills.map((skill, index) => (
                  <span key={index} className="tag">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Responsibilities</label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                rows={4}
                placeholder="List the key responsibilities for this role..."
              />
              <span className="char-count">{formData.responsibilities.length}/1500</span>
            </div>

            <div className="form-group">
              <label>Requirements</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                placeholder="List the requirements and qualifications..."
              />
              <span className="char-count">{formData.requirements.length}/1500</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="form-section">
            <h2>Benefits & Perks</h2>

            <div className="form-group">
              <label>Benefits</label>
              <div className="input-with-button">
                <input
                  type="text"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  placeholder="Add a benefit (e.g., Health Insurance, 401k)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                />
                <button type="button" onClick={addBenefit} className="btn-add-inline">
                  Add
                </button>
              </div>
              <div className="tags-container">
                {benefits.map((benefit, index) => (
                  <span key={index} className="tag benefit-tag">
                    {benefit}
                    <button type="button" onClick={() => removeBenefit(benefit)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Application Deadline</label>
              <input
                type="date"
                name="applicationDeadline"
                value={formData.applicationDeadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Posting Job..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
