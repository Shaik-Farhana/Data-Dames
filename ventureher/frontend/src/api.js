import axios from 'axios';

const API_BASES = [
    import.meta.env.VITE_API_URL,
    'http://localhost:8000',
    'http://localhost:8001',
].filter(Boolean);

const apiClients = API_BASES.map((baseURL) => axios.create({
    baseURL,
    timeout: 30000,
}));

async function requestWithFallback(config) {
    let lastError;

    for (const client of apiClients) {
        try {
            return await client.request(config);
        } catch (error) {
            lastError = error;

            if (error.response) {
                throw error;
            }
        }
    }

    throw lastError;
}

export const analyzeImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    const res = await requestWithFallback({
        method: 'post',
        url: '/analyze-image',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const addTransaction = async (text) => {
    const res = await requestWithFallback({
        method: 'post',
        url: '/add-transaction',
        data: { text },
    });
    return res.data;
};

export const getDashboard = async () => {
    const res = await requestWithFallback({
        method: 'get',
        url: '/dashboard',
    });
    return res.data;
};

export const getWeeklyReport = async () => {
    const res = await requestWithFallback({
        method: 'post',
        url: '/weekly-report',
    });
    return res.data;
};