import axios from "axios";

const API_URL = "https://prewise-ai-dn78.vercel.app/api/interview";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const generateInterview = async (role, skills, difficulty, numberOfQuestions) => {
    const response = await axios.post(`${API_URL}/generate`, {
        role, skills, difficulty, numberOfQuestions
    }, getAuthHeaders());
    return response.data;
};

export const getMyInterviews = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};

export const getInterviewById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};

export const submitAnswer = async (interviewId, questionIndex, answer) => {
    const response = await axios.post(`${API_URL}/${interviewId}/answer`, {
        questionIndex, answer
    }, getAuthHeaders());
    return response.data;
};

export const deleteInterview = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};
