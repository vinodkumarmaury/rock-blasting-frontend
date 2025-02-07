import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/colors';
import Button from '../common/Button';
import { useNotification } from '../../context/NotificationContext';
import authService from '../../services/authService';
import LoadingSpinner from '../common/LoadingSpinner';

const ProfileContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: ${theme.background.paper};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const Avatar = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${theme.background.gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const MainContent = styled.div`
  background: ${theme.background.paper};
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const TabList = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid ${theme.background.default};
  padding-bottom: 1rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: ${props => props.active ? theme.primary.main : theme.text.secondary};
  border-bottom: 2px solid ${props => props.active ? theme.primary.main : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: ${theme.primary.main};
  }
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${theme.text.primary};
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${theme.text.disabled};
  border-radius: 8px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.primary.main};
    box-shadow: 0 0 0 3px ${theme.primary.light}30;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: ${theme.background.default};
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
`;

const UserProfile = () => {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    bio: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await authService.fetchUserProfile();
      setUserData(profile);
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        bio: profile.bio || ''
      });
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      showNotification('Profile updated successfully', 'success');
      loadUserProfile();
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  return (
    <ProfileContainer>
      <ProfileGrid>
        <Sidebar>
          <Avatar>
            {userData?.username?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
          <h2>{userData?.username}</h2>
          <p>{userData?.email}</p>
          
          <StatsGrid>
            <StatCard>
              <h3>Predictions</h3>
              <p>150</p>
            </StatCard>
            <StatCard>
              <h3>Accuracy</h3>
              <p>95%</p>
            </StatCard>
          </StatsGrid>
        </Sidebar>

        <MainContent>
          <TabList>
            <Tab 
              active={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </Tab>
            <Tab 
              active={activeTab === 'security'} 
              onClick={() => setActiveTab('security')}
            >
              Security
            </Tab>
            <Tab 
              active={activeTab === 'preferences'} 
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </Tab>
          </TabList>

          {activeTab === 'profile' && (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Username</Label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Bio</Label>
                <Input
                  as="textarea"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                />
              </FormGroup>
              <Button type="submit">Save Changes</Button>
            </Form>
          )}
        </MainContent>
      </ProfileGrid>
    </ProfileContainer>
  );
};

export default UserProfile;