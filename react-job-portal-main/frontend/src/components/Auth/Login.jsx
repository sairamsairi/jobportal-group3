import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        // "https://24ddbf72b5bc.ngrok-free.app/api/v1/user/login",
        { email, password, role },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      toast.success(data.message);
      // Store user data in context
      if (data.user) {
        setUser(data.user);
      }
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };


  console.log(isAuthorized);
  if (isAuthorized) {
    return <Navigate to="/" />;
  }
  return (
    <div className="login-page">
      {/* Top-right buttons */}
      {/* Top-right buttons - Removed as they are now global in Navbar */}

      <div className="login-card">
        {/* Logo */}
        <div className="logo">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUtm-mTNWWUR9qEAm4IddtGrjmV3UUmTIBpw&s"
            alt="logo"
          />
          <h5>Here there</h5>
          <p>Login to continue</p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-box">
            <FaRegUser className="icon" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="drop"
              required
            >
              <option value="">Login As</option>
              <option value="Job Seeker">Job Seeker</option>
              <option value="Employer">Employer</option>
            </select>
          </div>

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
            Login
          </button>

          <div className="register-text">
            <p>
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>

      {/* Right Image */}
      <div className="login-side-img">
        <img src="/login.png" alt="banner" />
      </div>
    </div>
  );
};

export default Login;
