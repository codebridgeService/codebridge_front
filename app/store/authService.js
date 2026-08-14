import { apiFetch } from '../lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authService = {
  async register(name, email, password, password_confirmation) {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });
    if (!res.ok) { 
      const error = await res.json().catch(() => ({})); 
      throw new Error(error.error || error.message || 'Registration failed'); 
    }
    return res.json();
  },

  async verifyRegisterOTP(email, otp) {
    const res = await apiFetch('/auth/register/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Verification failed');
    }
    const data = await res.json();
    if (data.token && data.user) {
      this.setSession(data.token, data.user, data.refreshToken);
    }
    return data;
  },

  async resendRegisterOTP(email) {
    const res = await apiFetch('/auth/register/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || error.message || 'Failed to resend code');
    }
    return res.json();
  },

  async login(email, password) {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Login failed'); }
    return res.json();
  },

  async verifyOTP(email, otp) {
    const res = await apiFetch('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Verification failed'); }
    const data = await res.json();
    if (data.token && data.user) {
      this.setSession(data.token, data.user, data.refreshToken);
    }
    return data;
  },

  async resendOTP(email) {
    const res = await apiFetch('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (!res.ok) { const error = await res.json().catch(() => ({})); throw new Error(error.error || error.message || 'Failed to resend code'); }
    return res.json();
  },

  async logout() {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
  },

  async updateProfile(formData) {
    const res = await apiFetch('/auth/profile', {
      method: 'PUT',
      body: formData,
    });
    if (!res.ok) { 
      const error = await res.json().catch(() => ({})); 
      throw new Error(error.error || error.message || 'Failed to update profile'); 
    }
    return res.json();
  },

  async updatePassword(current_password, new_password) {
    const res = await apiFetch('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ current_password, new_password }),
    });
    if (!res.ok) { 
      const error = await res.json().catch(() => ({})); 
      throw new Error(error.error || error.message || 'Failed to update password'); 
    }
    return res.json();
  },

  async createProject(projectData) {
    const res = await apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    if (!res.ok) { 
      const error = await res.json().catch(() => ({})); 
      throw new Error(error.error || error.message || 'Failed to create project'); 
    }
    return res.json();
  },

  setSession(token, user, refreshToken) {
    if (token) localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    if (user) localStorage.setItem('user', JSON.stringify(user));
  },

  getSession() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    
    if (!userStr || userStr === 'undefined') {
      return { token, refreshToken, user: null };
    }

    try {
      return { token, refreshToken, user: JSON.parse(userStr) };
    } catch (e) {
      console.error("Error parsing user session:", e);
      return { token, refreshToken, user: null };
    }
  },

  getAuthHeader() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

