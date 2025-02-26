import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaUserCircle, 
  FaBars, 
  FaHome, 
  FaBook, 
  FaChartLine, 
  FaChartBar, 
  FaSignInAlt,
  FaCog,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import authService from "../services/authService";  // Import the service
import "../styles/Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // No need to show error if no token - just means user isn't logged in
          return;
        }
        
        // Use the authService instead of direct axios call
        const userData = await authService.getUserProfile();
        
        // Check if the username exists in the response
        if (userData.username) {
          setUsername(userData.username);
        } else if (userData.email) {
          // If no username but email is present, use that instead
          setUsername(userData.email.split('@')[0]);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/auth");
        }
      }
    };

    fetchUsername();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/auth");
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsExpanded(false);
  }, [location]);

  const NavLink = ({ to, icon: Icon, text }) => (
    <Link to={to} className={location.pathname === to ? "active" : ""}>
      <Icon className="nav-icon" />
      <span className="nav-link-text">{text}</span>
    </Link>
  );

  return (
    <>
      <div className="hamburger-menu" onClick={toggleNavbar}>
        <FaBars />
      </div>
      <nav className={`navbar ${isExpanded ? "expanded" : ""}`}>
        <div className="nav-links">
          <NavLink to="/" icon={FaHome} text="Home" />
          <NavLink to="/input-guide" icon={FaBook} text="Input Guide" />
          <NavLink to="/prediction" icon={FaChartLine} text="Prediction" />
          <NavLink to="/analysis" icon={FaChartBar} text="Analysis" />
        </div>

        {localStorage.getItem("token") ? (
          <div className="profile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="profile-header" onClick={toggleDropdown}>
              <FaUserCircle className="profile-icon" />
              <span className="nav-link-text username">{username}</span>
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile">
                  <FaUser />
                  <span>Profile</span>
                </Link>
                <Link to="/settings">
                  <FaCog />
                  <span>Settings</span>
                </Link>
                <button onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="login-container">
            <NavLink to="/auth" icon={FaSignInAlt} text="Login" />
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;