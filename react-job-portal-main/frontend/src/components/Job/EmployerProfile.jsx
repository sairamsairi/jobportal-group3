import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import "./profile.css";

const EmployerProfile = () => {
    const { isAuthorized, user } = useContext(Context);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        location: "",
        about: "",
        companyName: "",
        companyWebsite: "",
        companySize: "",
        industry: "",
        companyDescription: "",
        contactPerson: "",
        contactEmail: "",
        contactPhone: "",
    });

    const [companyLogo, setCompanyLogo] = useState(null);
    const [existingLogo, setExistingLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isAuthorized || user.role !== "Employer") {
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
                setIsEditing(false); // Default to view mode

                setFormData({
                    fullName: profile.fullName || "",
                    email: profile.email || "",
                    phone: profile.phone || "",
                    location: profile.location || "",
                    about: profile.about || "",
                    companyName: profile.companyName || "",
                    companyWebsite: profile.companyWebsite || "",
                    companySize: profile.companySize || "",
                    industry: profile.industry || "",
                    companyDescription: profile.companyDescription || "",
                    contactPerson: profile.contactPerson || "",
                    contactEmail: profile.contactEmail || "",
                    contactPhone: profile.contactPhone || "",
                });
                setExistingLogo(profile.companyLogo);
                if (profile.companyLogo) {
                    setLogoPreview(profile.companyLogo.url);
                }
            }
        } catch (error) {
            // Profile doesn't exist yet, that's okay
            console.log("No existing profile found");
            setIsEditing(true); // Default to edit mode if no profile
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Please upload a PNG, JPG, or WEBP image");
                return;
            }
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                toast.error("File size should be less than 2MB");
                return;
            }
            setCompanyLogo(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for compulsory fields
        if (!formData.companyName) {
            toast.error("Please enter your company name");
            return;
        }
        if (!formData.contactEmail) {
            toast.error("Please enter a contact email");
            return;
        }
        if (!companyLogo && !existingLogo) {
            toast.error("Please upload your company logo");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            if (companyLogo) {
                data.append("companyLogo", companyLogo);
            }

            const response = await axios.post(
                "http://localhost:4000/api/v1/profile",
                data,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setIsEditing(false); // Switch to View Mode
                fetchProfile(); // Refresh data
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save profile");
        } finally {
            setLoading(false);
        }
    };

    const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

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
                            <div className="company-header-info">
                                {existingLogo && (
                                    <img src={existingLogo.url} alt="Company Logo" className="view-logo-large" />
                                )}
                                <div>
                                    <h1>{formData.companyName || "Company Name"}</h1>
                                    <p className="profile-subtitle">{formData.industry} • {formData.companySize} Employees</p>
                                </div>
                            </div>
                            <button onClick={() => setIsEditing(true)} className="btn-edit">
                                ✏️ Edit Profile
                            </button>
                        </div>

                        {formData.companyWebsite && (
                            <div className="view-section">
                                <a href={formData.companyWebsite} target="_blank" rel="noopener noreferrer" className="website-link">
                                    🌐 {formData.companyWebsite}
                                </a>
                            </div>
                        )}

                        <div className="view-section">
                            <h3>About Company</h3>
                            <p>{formData.companyDescription || "No description provided."}</p>
                        </div>

                        <div className="view-section">
                            <h3>Contact Information</h3>
                            <div className="view-grid">
                                <div className="view-item">
                                    <p className="label">Contact Person</p>
                                    <p>{formData.contactPerson}</p>
                                </div>
                                <div className="view-item">
                                    <p className="label">Email</p>
                                    <p>{formData.contactEmail}</p>
                                </div>
                                <div className="view-item">
                                    <p className="label">Phone</p>
                                    <p>{formData.contactPhone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="view-section">
                            <h3>Personal Details (My Profile)</h3>
                            <div className="view-grid">
                                <div className="view-item">
                                    <p className="label">Name</p>
                                    <p>{formData.fullName}</p>
                                </div>
                                <div className="view-item">
                                    <p className="label">Email</p>
                                    <p>{formData.email}</p>
                                </div>
                                <div className="view-item">
                                    <p className="label">Role</p>
                                    <p>Employer / Recruiter</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // EDIT MODE
                    <>
                        <h1 className="text-center">Edit Employer Profile</h1>
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
                                            placeholder="your.email@company.com"
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
                                    <label>About</label>
                                    <textarea
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Brief description about yourself..."
                                    />
                                </div>
                            </div>

                            {/* Company Information */}
                            <div className="form-section">
                                <h2>Company Information</h2>

                                {/* Company Logo */}
                                <div className="logo-upload-section">
                                    <label>Company Logo</label>
                                    <div className="logo-upload-container">
                                        {logoPreview && (
                                            <div className="logo-preview">
                                                <img src={logoPreview} alt="Company Logo" />
                                            </div>
                                        )}
                                        <div className="logo-upload-input">
                                            <input
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                                onChange={handleLogoChange}
                                                id="logo-upload"
                                            />
                                            <label htmlFor="logo-upload" className="btn-upload">
                                                {logoPreview ? "Change Logo" : "Upload Logo"}
                                            </label>
                                            <p className="file-hint">PNG, JPG, or WEBP (max 2MB)</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Company Name *</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your company name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Company Website</label>
                                        <input
                                            type="url"
                                            name="companyWebsite"
                                            value={formData.companyWebsite}
                                            onChange={handleChange}
                                            placeholder="https://www.yourcompany.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Company Size</label>
                                        <select
                                            name="companySize"
                                            value={formData.companySize}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select company size</option>
                                            {companySizes.map((size) => (
                                                <option key={size} value={size}>
                                                    {size} employees
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Industry</label>
                                        <input
                                            type="text"
                                            name="industry"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            placeholder="e.g., Technology, Healthcare, Finance"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Company Description</label>
                                    <textarea
                                        name="companyDescription"
                                        value={formData.companyDescription}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Describe your company, its mission, culture, and what makes it a great place to work..."
                                    />
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="form-section">
                                <h2>Contact Details</h2>
                                <p className="section-description">
                                    These details will be visible to job seekers who want to reach out
                                </p>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Contact Person</label>
                                        <input
                                            type="text"
                                            name="contactPerson"
                                            value={formData.contactPerson}
                                            onChange={handleChange}
                                            placeholder="HR Manager name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Contact Email</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleChange}
                                            placeholder="hr@company.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Contact Phone</label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            value={formData.contactPhone}
                                            onChange={handleChange}
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
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

export default EmployerProfile;
