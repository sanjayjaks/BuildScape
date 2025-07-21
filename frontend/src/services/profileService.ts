import api from './api';

export interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export const profileService = {
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(profileData: Partial<ProfileData>) {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  }
}; 