import axios from "axios";

const API_URL = "https://prewise-ai-dn78.vercel.app/api/jobs";
const RESUME_API_URL = "https://prewise-ai-dn78.vercel.app/api/resume";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const createJob = async (jobData) => {
    const response = await axios.post(API_URL, jobData, getAuthHeaders());
    return response.data;
};

export const getMyJobs = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

export const updateJob = async (id, jobData) => {
    const response = await axios.put(`${API_URL}/${id}`, jobData, getAuthHeaders());
    return response.data;
};

export const deleteJob = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};

export const getSmartSuggestions = async () => {
    const response = await axios.get(`${RESUME_API_URL}/suggestions`, getAuthHeaders());
    return response.data;
};
