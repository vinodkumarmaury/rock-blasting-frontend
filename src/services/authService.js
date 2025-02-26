import axios from 'axios';

// Always hardcode the base URL to avoid any environment variable issues
const BASE_URL = 'http://localhost:8000';

const authService = {
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Always use the /api/ prefix
      const response = await axios.get(`${BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Failed to load profile');
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      // First get the current user data to include email
      const userData = await authService.getUserProfile();
      
      // Create complete profile data with all required fields
      const completeProfileData = {
        // Include the email from current profile data
        email: userData.email,
        // Include password field (use a placeholder if not changing password)
        password: profileData.password || "unchanged_password_placeholder",
        // Include the rest of the profile data
        username: profileData.username,
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        bio: profileData.bio || ""
      };
      
      console.log('Sending profile update:', completeProfileData);
      
      const response = await axios.put(`${BASE_URL}/api/update-profile`, completeProfileData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }
};

export default authService;