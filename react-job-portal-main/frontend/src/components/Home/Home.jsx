import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import "./home.css";

// Icons
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus, FaReact, FaMicrosoft, FaApple } from "react-icons/fa";
import { MdFindInPage, MdOutlineDesignServices, MdOutlineWebhook, MdAccountBalance, MdOutlineAnimation } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { GiRocket, GiArtificialIntelligence } from "react-icons/gi";
import { TbAppsFilled } from "react-icons/tb";
import { IoGameController } from "react-icons/io5";
import { SiTesla } from "react-icons/si";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        // "http://localhost:4000/api/v1/user/logout",
        "https://2fc627b7f488.ngrok-free.app/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    }
  };

  // Data for Hero Section
  const heroDetails = [
    { id: 1, title: "10000", subTitle: "Live Job", icon: <FaSuitcase /> },
    { id: 2, title: "10000", subTitle: "Companies", icon: <FaBuilding /> },
    { id: 3, title: "10000", subTitle: "Job Seekers", icon: <FaUsers /> },
    { id: 4, title: "10000", subTitle: "Employers", icon: <FaUserPlus /> },
  ];

  // Data for How It Works Section
  const howItWorksSteps = [
    { id: 1, title: "Create Account", desc: "Sign up and set up your professional profile quickly.", icon: <FaUserPlus /> },
    { id: 2, title: "Find / Post Jobs", desc: "Explore thousands of jobs or post vacancies easily.", icon: <MdFindInPage /> },
    { id: 3, title: "Apply / Recruit", desc: "Job seekers apply, employers hire the best candidates.", icon: <IoMdSend /> },
    { id: 4, title: "Start Your Journey", desc: "Kickstart your career or recruitment process efficiently.", icon: <GiRocket /> },
  ];

  // Data for Popular Categories
  const categories = [
    { id: 1, title: "Graphics & Design", subTitle: "305 Open Positions", icon: <MdOutlineDesignServices /> },
    { id: 2, title: "Mobile App Development", subTitle: "500 Open Positions", icon: <TbAppsFilled /> },
    { id: 3, title: "Frontend Web Development", subTitle: "200 Open Positions", icon: <MdOutlineWebhook /> },
    { id: 4, title: "MERN STACK Development", subTitle: "1000+ Open Postions", icon: <FaReact /> },
    { id: 5, title: "Account & Finance", subTitle: "150 Open Positions", icon: <MdAccountBalance /> },
    { id: 6, title: "Artificial Intelligence", subTitle: "867 Open Positions", icon: <GiArtificialIntelligence /> },
    { id: 7, title: "Video Animation", subTitle: "50 Open Positions", icon: <MdOutlineAnimation /> },
    { id: 8, title: "Game Development", subTitle: "80 Open Positions", icon: <IoGameController /> },
  ];

  // Data for Popular Companies
  const companies = [
    { id: 1, title: "Microsoft", location: "Millennium City Centre, Gurugram", openPositions: 10, icon: <FaMicrosoft /> },
    { id: 2, title: "Tesla", location: "Millennium City Centre, Gurugram", openPositions: 5, icon: <SiTesla /> },
    { id: 3, title: "Apple", location: "Millennium City Centre, Gurugram", openPositions: 20, icon: <FaApple /> },
  ];

  return (
    <div className="home-page">
      {/* Top Buttons (Navigation Links) */}
      {/* Top Buttons (Navigation Links) - Removed as they are now global in Navbar */}

      {/* Hero Section */}
      <div className="heroSection">
        <div className="container">
          <div className="title">
            <h1>Get a job that suits</h1>
            <h1>your interests and skills</h1>
            <p>
              Get job opportunities that match your skills and passions.
              Connect with employers seeking talent like yours for rewarding
              careers.
            </p>
          </div>
          <div className="image">
            <img src="/heroS.jpg" alt="hero" />
          </div>
        </div>
        <div className="details">
          {heroDetails.map((element) => (
            <div className="card" key={element.id}>
              <div className="icon">{element.icon}</div>
              <div className="content">
                <p>{element.title}</p>
                <p>{element.subTitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h3>How Our Job Portal Works</h3>
          <div className="banner">
            {howItWorksSteps.map((step) => (
              <div key={step.id} className="card">
                <div className="icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="popular-categories">
        <div className="container">
          <h3>Popular Categories</h3>

          <div className="cards">
            {categories.map((item) => (
              <div className="card" key={item.id}>
                <div className="icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.subTitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Popular Companies Section */}
      <div className="companies">
        <div className="container">
          <h3>TOP COMPANIES</h3>
          <div className="banner">
            {companies.map((element) => (
              <div className="card" key={element.id}>
                <div className="content">
                  <div className="icon">{element.icon}</div>
                  <div className="text">
                    <p>{element.title}</p>
                    <p>{element.location}</p>
                  </div>
                </div>
                <button>Open Positions {element.openPositions}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
