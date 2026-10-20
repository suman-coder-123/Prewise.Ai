import axios from "axios";

const API_URL = "https://prewise-ai-dn78.vercel.app//api/auth";

export const loginUser = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export const registerUser = async (fullName, email, password) => {
    const response = await axios.post(`${API_URL}/register`, { fullName, email, password });
    return response.data;
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
