import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useNotification } from '../context/NotificationContext';
import '../styles/Profile.css';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    // First load data from localStorage if available
    const cachedUserData = JSON.parse(localStorage.getItem('userData'));
    if (cachedUserData) {
      setUsername(cachedUserData.username || '');
      setEmail(cachedUserData.email || '');
      setFirstName(cachedUserData.firstName || '');
      setLastName(cachedUserData.lastName || '');
      setBio(cachedUserData.bio || '');
    }

    // Then fetch current user data from server
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserProfile();
        
        // Update state with fetched data
        setUsername(userData.username);
        setEmail(userData.email);
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setBio(userData.bio || '');
        
        // Store in localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(userData));
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.message.includes('token') || 
            (error.response && error.response.status === 401)) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData'); // Clear cached user data on auth failure
          navigate('/auth');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        username,
        firstName,
        lastName,
        bio,
        password: showPasswordField ? password : undefined
      };
      
      const updatedProfile = await authService.updateProfile(profileData);
      
      // Update localStorage with new data
      const userData = {
        username,
        email,
        firstName,
        lastName,
        bio
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      showNotification('Profile updated successfully', 'success');
      console.log('Profile updated:', updatedProfile);
      
      // Reset password field after successful update
      if (showPasswordField) {
        setPassword('');
        setShowPasswordField(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile', 'error');
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-info">
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>First Name:</strong> {firstName}</p>
        <p><strong>Last Name:</strong> {lastName}</p>
        <p><strong>Bio:</strong> {bio}</p>
      </div>

      <form className="profile-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
          />
        </div>

        <div className="form-group">
          <button 
            type="button" 
            className="toggle-password-btn"
            onClick={() => setShowPasswordField(!showPasswordField)}
          >
            {showPasswordField ? 'Cancel Password Change' : 'Change Password'}
          </button>

          {showPasswordField && (
            <div className="password-change-section">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
          )}
        </div>

        <button type="submit" className="save-button">Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;