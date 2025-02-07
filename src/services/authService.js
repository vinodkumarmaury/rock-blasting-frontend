import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/api/signin`, {
        email,
        password
      });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        await this.fetchUserProfile();
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(username, email, password) {
    try {
      const response = await axios.post(`${API_URL}/api/signup`, {
        username,
        email,
        password
      });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        await this.fetchUserProfile();
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async fetchUserProfile() {
    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: this.getAuthHeader()
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async forgotPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/api/forgot-password`, {
        email
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(`${API_URL}/api/reset-password`, {
        token,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(userData) {
    try {
      const response = await axios.put(
        `${API_URL}/api/update-profile`,
        userData,
        { headers: this.getAuthHeader() }
      );
      await this.fetchUserProfile(); // Refresh user data
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  handleError(error) {
    if (error.response) {
      if (error.response.status === 401) {
        this.logout();
      }
      throw new Error(error.response.data.detail || 'An error occurred');
    }
    throw new Error('Network error');
  }
}

export default new AuthService();