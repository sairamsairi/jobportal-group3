import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const JobSeekerProfile = () => {
    const { isAuthorized, user } = useContext(Context);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        about: "",
        skills: [],
        portfolioLinks: [],
    });

    const [education, setEducation] = useState([
        { institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }
    ]);

    const [experience, setExperience] = useState([
        { company: "", role: "", startDate: "", endDate: "", description: "" }
    ]);

    const [skillInput, setSkillInput] = useState("");
    const [portfolioInput, setPortfolioInput] = useState("");
    const [resume, setResume] = useState(null);
    const [existingResume, setExistingResume] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isAuthorized || user.role !== "Job Seeker") {
            navigate("/");
        } else {
            fetchProfile();
        }
    }, [isAuthorized, user]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/v1/profile/me",
                { withCredentials: true }
            );

            if (response.data.success) {
                const profile = response.data.profile;
                // If profile exists, we are NOT editing by default
                setIsEditing(false);

                setFormData({
                    fullName: profile.fullName || "",
                    email: profile.email || "",
                    phone: profile.phone || "",
                    location: profile.location || "",
                    about: profile.about || "",
                    skills: profile.skills || [],
                    portfolioLinks: profile.portfolioLinks || [],
                });
                setEducation(profile.education && profile.education.length > 0
                    ? profile.education
                    : [{ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }]
                );
                setExperience(profile.experience && profile.experience.length > 0
                    ? profile.experience
                    : [{ company: "", role: "", startDate: "", endDate: "", description: "" }]
                );
                setExistingResume(profile.resume);
            }
        } catch (error) {
            // No profile found, so we must be in editing (creation) mode
            console.log("No existing profile found");
            setIsEditing(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...education];
        newEducation[index][field] = value;
        setEducation(newEducation);
    };

    const addEducation = () => {
        setEducation([...education, { institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }]);
    };

    const removeEducation = (index) => {
        if (education.length > 1) {
            setEducation(education.filter((_, i) => i !== index));
        }
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...experience];
        newExperience[index][field] = value;
        setExperience(newExperience);
    };

    const addExperience = () => {
        setExperience([...experience, { company: "", role: "", startDate: "", endDate: "", description: "" }]);
    };

    const removeExperience = (index) => {
        if (experience.length > 1) {
            setExperience(experience.filter((_, i) => i !== index));
        }
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData({ ...formData, skills: formData.skills.filter(skill => skill !== skillToRemove) });
    };

    const addPortfolio = () => {
        if (portfolioInput.trim() && !formData.portfolioLinks.includes(portfolioInput.trim())) {
            setFormData({ ...formData, portfolioLinks: [...formData.portfolioLinks, portfolioInput.trim()] });
            setPortfolioInput("");
        }
    };

    const removePortfolio = (linkToRemove) => {
        setFormData({ ...formData, portfolioLinks: formData.portfolioLinks.filter(link => link !== linkToRemove) });
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Please upload a PDF or DOC file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("File size should be less than 5MB");
                return;
            }
            setResume(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for compulsory fields
        if (education.length === 0 || !education[0].institution) {
            toast.error("Please add at least one education/college entry");
            return;
        }

        if (formData.skills.length === 0) {
            toast.error("Please add at least one skill");
            return;
        }

        if (!resume && !existingResume) {
            toast.error("Please upload your resume");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();

            // Add basic fields
            data.append("fullName", formData.fullName);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("location", formData.location);
            data.append("about", formData.about);

            // Add arrays as JSON strings
            data.append("education", JSON.stringify(education));
            data.append("experience", JSON.stringify(experience));
            data.append("skills", JSON.stringify(formData.skills));
            data.append("portfolioLinks", JSON.stringify(formData.portfolioLinks));

            // Add resume if selected
            if (resume) {
                data.append("resume", resume);
            }

            const response = await axios.post(
                "http://localhost:4000/api/v1/profile",
                data,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setIsEditing(false); // Switch back to view mode
                fetchProfile(); // Refresh data to show in view mode
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="profile-page"><div className="profile-container"><h1>Loading...</h1></div></div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {!isEditing ? (
                    // VIEW MODE
                    <div className="profile-view">
                        <div className="view-header">
                            <div>
                                <h1>{formData.fullName || "Your Name"}</h1>
                                <p className="profile-subtitle">{formData.location || "Add Location"}</p>
                            </div>
                            <button onClick={() => setIsEditing(true)} className="btn-edit">
                                ✏️ Edit Profile
                            </button>
                        </div>

                        <div className="view-section">
                            <div className="view-details">
                                <p><strong>Email:</strong> {formData.email}</p>
                                <p><strong>Phone:</strong> {formData.phone}</p>
                            </div>
                        </div>

                        {formData.about && (
                            <div className="view-section">
                                <h3>About Me</h3>
                                <p>{formData.about}</p>
                            </div>
                        )}

                        <div className="view-section">
                            <h3>Skills</h3>
                            <div className="tags-container">
                                {formData.skills.map((skill, index) => (
                                    <span key={index} className="tag view-tag">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="view-section">
                            <h3>Education</h3>
                            {education.map((edu, index) => (
                                <div key={index} className="view-item">
                                    <h4>{edu.institution}</h4>
                                    <p>{edu.degree} in {edu.fieldOfStudy}</p>
                                    <span className="date-range">{edu.startYear} - {edu.endYear}</span>
                                </div>
                            ))}
                        </div>

                        <div className="view-section">
                            <h3>Experience</h3>
                            {experience.length > 0 && experience[0].company ? (
                                experience.map((exp, index) => (
                                    <div key={index} className="view-item">
                                        <h4>{exp.role} at {exp.company}</h4>
                                        <span className="date-range">
                                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ""} -
                                            {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                                        </span>
                                        <p>{exp.description}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No experience added.</p>
                            )}
                        </div>

                        <div className="view-section">
                            <h3>Resume & Portfolio</h3>
                            {existingResume ? (
                                <a href={existingResume.url} target="_blank" rel="noopener noreferrer" className="btn-view-resume">
                                    📄 View Resume
                                </a>
                            ) : <p>No resume uploaded.</p>}

                            <div className="links-container mt-3">
                                {formData.portfolioLinks.map((link, index) => (
                                    <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="portfolio-link">
                                        🔗 {link}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // EDIT MODE (Exist Form)
                    <>
                        <h1 className="text-center">Edit Profile</h1>
                        <form className="profile-form" onSubmit={handleSubmit}>
                            {/* Personal Information */}
                            <div className="form-section">
                                <h2>Personal Information</h2>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Full Name *</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>About Me</label>
                                    <textarea
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Tell us about yourself, your career goals, and what makes you unique..."
                                    />
                                </div>
                            </div>

                            {/* Education */}
                            <div className="form-section">
                                <div className="section-header">
                                    <h2>Education</h2>
                                    <button type="button" className="btn-add" onClick={addEducation}>
                                        + Add Education
                                    </button>
                                </div>

                                {education.map((edu, index) => (
                                    <div key={index} className="dynamic-item">
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Institution</label>
                                                <input
                                                    type="text"
                                                    value={edu.institution}
                                                    onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                                                    placeholder="University/College name"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Degree</label>
                                                <input
                                                    type="text"
                                                    value={edu.degree}
                                                    onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                                                    placeholder="Bachelor's, Master's, etc."
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Field of Study</label>
                                                <input
                                                    type="text"
                                                    value={edu.fieldOfStudy}
                                                    onChange={(e) => handleEducationChange(index, "fieldOfStudy", e.target.value)}
                                                    placeholder="Computer Science, etc."
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Start Year</label>
                                                <input
                                                    type="number"
                                                    value={edu.startYear}
                                                    onChange={(e) => handleEducationChange(index, "startYear", e.target.value)}
                                                    placeholder="2020"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>End Year</label>
                                                <input
                                                    type="number"
                                                    value={edu.endYear}
                                                    onChange={(e) => handleEducationChange(index, "endYear", e.target.value)}
                                                    placeholder="2024"
                                                />
                                            </div>
                                        </div>

                                        {education.length > 1 && (
                                            <button type="button" className="btn-remove" onClick={() => removeEducation(index)}>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Experience */}
                            <div className="form-section">
                                <div className="section-header">
                                    <h2>Work Experience</h2>
                                    <button type="button" className="btn-add" onClick={addExperience}>
                                        + Add Experience
                                    </button>
                                </div>

                                {experience.map((exp, index) => (
                                    <div key={index} className="dynamic-item">
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Company</label>
                                                <input
                                                    type="text"
                                                    value={exp.company}
                                                    onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                                                    placeholder="Company name"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Role</label>
                                                <input
                                                    type="text"
                                                    value={exp.role}
                                                    onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                                                    placeholder="Job title"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>Start Date</label>
                                                <input
                                                    type="date"
                                                    value={exp.startDate}
                                                    onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>End Date</label>
                                                <input
                                                    type="date"
                                                    value={exp.endDate}
                                                    onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                value={exp.description}
                                                onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                                                rows={3}
                                                placeholder="Describe your responsibilities and achievements..."
                                            />
                                        </div>

                                        {experience.length > 1 && (
                                            <button type="button" className="btn-remove" onClick={() => removeExperience(index)}>
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Skills */}
                            <div className="form-section">
                                <h2>Skills</h2>
                                <div className="input-with-button">
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        placeholder="Add a skill (e.g., JavaScript, Python)"
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                                    />
                                    <button type="button" onClick={addSkill} className="btn-add-inline">
                                        Add
                                    </button>
                                </div>
                                <div className="tags-container">
                                    {formData.skills.map((skill, index) => (
                                        <span key={index} className="tag">
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)}>×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Portfolio Links */}
                            <div className="form-section">
                                <h2>Portfolio Links</h2>
                                <div className="input-with-button">
                                    <input
                                        type="url"
                                        value={portfolioInput}
                                        onChange={(e) => setPortfolioInput(e.target.value)}
                                        placeholder="Add portfolio/LinkedIn/GitHub link"
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPortfolio())}
                                    />
                                    <button type="button" onClick={addPortfolio} className="btn-add-inline">
                                        Add
                                    </button>
                                </div>
                                <div className="links-container">
                                    {formData.portfolioLinks.map((link, index) => (
                                        <div key={index} className="link-item">
                                            <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                                            <button type="button" onClick={() => removePortfolio(link)}>×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resume Upload */}
                            <div className="form-section">
                                <h2>Resume</h2>
                                {existingResume && (
                                    <div className="existing-file">
                                        <p>Current Resume: <a href={existingResume.url} target="_blank" rel="noopener noreferrer">View Resume</a></p>
                                    </div>
                                )}
                                <div className="form-group">
                                    <label>Upload Resume (PDF or DOC, max 5MB)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeChange}
                                    />
                                    {resume && <p className="file-selected">Selected: {resume.name}</p>}
                                </div>
                            </div>

                            <div className="button-group">
                                <button type="button" onClick={() => setIsEditing(false)} className="btn-cancel">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default JobSeekerProfile;
