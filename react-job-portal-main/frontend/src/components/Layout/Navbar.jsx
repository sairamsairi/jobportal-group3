import React, { useContext } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();





  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        // "https://24ddbf72b5bc.ngrok-free.app/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    }
  };

  return (
    <div className="top-buttons">
      <Link to="/" className="nav-btn">HOME</Link>

      {/* Before Login */}
      {!isAuthorized && (
        <>
          <Link to="/login" className="nav-btn">LOGIN</Link>
          <Link to="/register" className="nav-btn">REGISTER</Link>
        </>
      )}

      {/* After Login */}
      {isAuthorized && (
        <>
          <Link
            to={user && user.role === "Job Seeker" ? "/profile/jobseeker" : "/profile/employer"}
            className="nav-btn"
          >
            PROFILE
          </Link>
          <Link to="/job/getall" className="nav-btn">ALL JOBS</Link>
          <Link to="/applications/me" className="nav-btn">
            {user && user.role === "Job Seeker" ? "APPLICATIONS" : "MY APPLICATIONS"}
          </Link>

          {user && user.role === "Employer" && (
            <>
              <Link to="/job/post" className="nav-btn">POST NEW JOB</Link>
              <Link to="/job/me" className="nav-btn">VIEW YOUR JOBS</Link>
            </>
          )}

          <button onClick={handleLogout} className="logout-btn">LOGOUT</button>
        </>
      )}
    </div>
  );
};

export default Navbar;























