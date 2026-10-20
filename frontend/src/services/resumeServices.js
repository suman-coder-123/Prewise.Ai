import axios from "axios";
const API_URL = "http://localhost:5000/api/resume";

export const getMyResumes = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getResumeById = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteResume = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const uploadResume = async (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("resume", file);
    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
