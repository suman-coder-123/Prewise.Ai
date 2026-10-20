import axios from "axios";

const API_URL = "https://prewise-ai-dn78.vercel.app/api/auth";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getPreferences = async () => {
  const response = await axios.get(`${API_URL}/me`, authHeaders());
  return response.data;
};

export const updatePreferences = async (preferences) => {
  const response = await axios.put(`${API_URL}/preferences`, preferences, authHeaders());
  return response.data;
};
