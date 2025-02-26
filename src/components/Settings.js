import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useNotification } from '../context/NotificationContext';
import '../styles/Settings.css';

const Settings = () => {
  const [userData, setUserData] = useState({});
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Use authService instead of direct axios call
        const data = await authService.getUserProfile();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.message.includes('token') || 
            (error.response && error.response.status === 401)) {
          localStorage.removeItem('token');
          navigate('/auth');
        }
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Change updateUserProfile to updateProfile
      const updatedSettings = await authService.updateProfile(userData);
      
      showNotification('Settings updated successfully', 'success');
      console.log('Settings updated:', updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      showNotification('Failed to update settings', 'error');
    }
  };
  
  return (
    <div className="settings-container">
      <h2>Settings</h2>
      {/* Form submission status will be shown through notifications */}
      <form className="settings-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={userData.username || ''}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={userData.email || ''}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={userData.firstName || ''}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={userData.lastName || ''}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Bio:</label>
          <textarea
            value={userData.bio || ''}
            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
          />
        </div>
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
};

export default Settings;