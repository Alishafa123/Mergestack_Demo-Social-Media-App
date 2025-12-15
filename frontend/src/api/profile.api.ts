import api from "../services/axios";
import type { ProfileFormData } from "../schemas/profileSchemas";

export const getProfile = async () => {
  const res = await api.get("/profile/me");
  return res.data;
};

export const updateProfile = async (data: ProfileFormData & { profileImage?: File }) => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'profileImage' && value instanceof File) {
      formData.append('profileImage', value);
    } else if (value !== undefined && value !== null && key !== 'profileImage' && key !== 'profile_url') {
      formData.append(key, String(value));
    }
  });

  const res = await api.put("/profile/me", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deleteProfile = async () => {
  const res = await api.delete("/profile/me");
  return res.data;
};