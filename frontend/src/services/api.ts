import axios from 'axios';

// In development, we can use the relative path because of the proxy (if configured)
// or point directly to localhost:3001
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling hook (e.g., for toasts)
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);
