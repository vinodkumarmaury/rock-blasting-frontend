import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import '../styles/AuthPage.css';

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp && formData.password !== formData.confirmPassword) {
        setLoading(false);
        return setError("Passwords do not match");
      }

      const baseURL = process.env.REACT_APP_API_BASE_URL;
      // Add /api/ prefix to the endpoints
      const endpoint = isSignUp ? "/api/signup" : "/api/signin";
      
      console.log(`Sending auth request to: ${baseURL}${endpoint}`);
      
      const response = await axios.post(`${baseURL}${endpoint}`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // Get token from response - check different formats
      let token = null;
      
      if (response.data.access_token) {
        token = response.data.access_token;
      } else if (response.data.token) {
        token = response.data.token;
      } else if (response.headers.authorization) {
        // Some APIs return token in header
        token = response.headers.authorization.replace('Bearer ', '');
      }
      
      if (!token) {
        throw new Error('Authentication failed - no token received');
      }
      
      // Store token in localStorage
      localStorage.setItem("token", token);
      
      navigate("/prediction");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || "Authentication failed");
      } else if (err.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
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
              disabled={loading}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          {isSignUp && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="auth-links">
          <button
            className="toggle-link"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
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