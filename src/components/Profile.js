import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
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
        console.log("Profile Data : ",response.data)
        setUsername(response.data.username);
        setEmail(response.data.email);
        setFirstName(response.data.firstName || ''); // Corrected key
        setLastName(response.data.lastName || ''); // Corrected key
        setBio(response.data.bio || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/auth');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

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
    </div>
  );
};

export default Profile;