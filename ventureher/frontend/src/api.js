import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: 30000,
});

export const analyzeImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    const res = await API.post('/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const addTransaction = async (text) => {
    const res = await API.post('/add-transaction', { text });
    return res.data;
};

export const getDashboard = async () => {
    const res = await API.get('/dashboard');
    return res.data;
};

export const getWeeklyReport = async () => {
    const res = await API.post('/weekly-report');
    return res.data;
};