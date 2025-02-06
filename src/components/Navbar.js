import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa"; // Import a user icon from react-icons
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching username:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/auth');
        }
      }
    };

    fetchUsername();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/input-guide">Input Guide</Link>
      <Link to="/prediction">Prediction</Link>
      <Link to="/analysis">Analysis</Link>
      
      {localStorage.getItem("token") ? (
        <div className="profile-menu">
          <FaUserCircle className="profile-icon" onClick={toggleDropdown} />
          <span className="username">{username}</span>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/profile">Profile</Link>
              <Link to="/settings">Settings</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <Link to="/auth">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;