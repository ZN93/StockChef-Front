import axios from "axios";

export const apiClient = axios.create({
    baseURL: "/api",
    timeout: 30000,
});

export const authApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL ?? "https://stockchef-back.onrender.com/api",
});

type StoredAuth = {
    token?: string | null;
};

apiClient.interceptors.request.use((config) => {
    const raw = localStorage.getItem("stockchef_auth");
    if (raw) {
        try {
            const auth = JSON.parse(raw) as StoredAuth;
            if (auth.token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${auth.token}`;
            }
        } catch (error) {
            void error;
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("stockchef_auth");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

authApi.interceptors.request.use((config) => {
    const raw = localStorage.getItem("stockchef_auth");
    if (raw) {
        try {
            const auth = JSON.parse(raw) as StoredAuth;
            if (auth.token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${auth.token}`;
            }
        } catch (error) {
            void error;
        }
    }
    return config;
});

authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("stockchef_auth");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
