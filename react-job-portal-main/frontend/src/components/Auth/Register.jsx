import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import "./Login.css";  // reuse same CSS

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        // "https://24ddbf72b5bc.ngrok-free.app/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
      // setIsAuthorized(true);
      navigateTo("/login");
      // navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };
  // if (isAuthorized) {
  //     return <Navigate to="/login"/>;
  //   }

  return (
    <div className="login-page">
      {/* Top-right buttons - Removed as they are now global in Navbar */}

      {/* Glass card (same as login-card but reused for register) */}
      <div className="login-card">
        {/* Logo / Header */}
        <div className="logo">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5cyCOTCV7zWEu_n4fOiFXzt2OnE1a2iERlA&s" alt="logo" />
          <h5>Create a new account</h5>
          <p>Register to get started</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleRegister}>
          {/* Role */}
          <div className="input-box">
            <FaRegUser className="icon" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              class="drop"
              required
            >
              <option value="">Register As</option>
              <option value="Employer">Employer</option>
              <option value="Job Seeker">Job Seeker</option>
            </select>
          </div>

          {/* Name */}
          <div className="input-box">
            <FaPencilAlt className="icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="input-box">
            <MdOutlineMailOutline className="icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="input-box">
            <FaPhoneFlip className="icon" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="input-box">
            <RiLock2Fill className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Register
          </button>

          <div className="register-text">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>

      {/* Right Image (reuse same side image container) */}
      <div className="login-side-img">
        <img src="/register.png" alt="register-banner" />
      </div>
    </div>
  );
};

export default Register;
