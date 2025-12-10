import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./profile.css";

const JobSeekerProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    institution: "",
    major: "",
    year: "",
    skills: "",
    experience: "",
    about: "",
    portfolio: "",
    cv: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cv") {
      setFormData({ ...formData, cv: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axios.post(
        "http://localhost:4000/api/v1/profile",
        // "https://2fc627b7f488.ngrok-free.app/api/v1/profile",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Profile saved successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        institution: "",
        major: "",
        year: "",
        skills: "",
        experience: "",
        about: "",
        portfolio: "",
        cv: null,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Create Your Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location (City, Country)"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          type="text"
          name="institution"
          placeholder="Institution / University"
          value={formData.institution}
          onChange={handleChange}
        />
        <input
          type="text"
          name="major"
          placeholder="Major / Field of Study"
          value={formData.major}
          onChange={handleChange}
        />
        <input
          type="text"
          name="year"
          placeholder="Year of Graduation"
          value={formData.year}
          onChange={handleChange}
        />
        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={handleChange}
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience (years)"
          value={formData.experience}
          onChange={handleChange}
        />
        <textarea
          name="about"
          placeholder="About You"
          value={formData.about}
          onChange={handleChange}
          rows={4}
        />
        <input
          type="text"
          name="portfolio"
          placeholder="Portfolio / LinkedIn / GitHub"
          value={formData.portfolio}
          onChange={handleChange}
        />
        <input
          type="file"
          name="cv"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default JobSeekerProfile;
