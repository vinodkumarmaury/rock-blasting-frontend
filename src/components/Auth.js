import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import '../styles/AuthPage.css'; // Make sure to import the CSS

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp && formData.password !== formData.confirmPassword) {
        return setError("Passwords do not match");
      }

      const baseURL = process.env.REACT_APP_API_BASE_URL;
      const endpoint = isSignUp ? "/signup" : "/signin";
      
      const response = await axios.post(`${baseURL}${endpoint}`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (!isSignUp) {
        localStorage.setItem("token", response.data.access_token);
        navigate("/prediction");
      } else {
        alert("Account created successfully! Please sign in.");
        setIsSignUp(false);
        setFormData({ username: "", email: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {isSignUp && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" className="auth-button">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="auth-links">
          <button
            className="toggle-link"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create Account"}
          </button>

          {!isSignUp && (
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;