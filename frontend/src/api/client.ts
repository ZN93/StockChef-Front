import axios from "axios";

/**
 * Cliente configurado para usar backend real via proxy Vite
 * Proxy redirige /api a Railway para evitar CORS
 */
export const apiClient = axios.create({
    baseURL: "/api", // Usa proxy de Vite que redirige a Railway
    timeout: 30000,
});

/**
 * Client utilisé pour les mocks locaux (MSW)
 * En dev il pointe sur /api pour être intercepté par MSW (mocks)
 */
export const api = axios.create({
    baseURL: "/api",
});

/**
 * Client dédié au backend Spring (authentification).
 * On passe par une autre instance pour ne pas casser les mocks.
 */
export const authApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL ?? "https://stockchef-back.onrender.com/api",
});

type StoredAuth = {
    token?: string | null;
};

// Interceptor para apiClient (backend real)
apiClient.interceptors.request.use((config) => {
    console.log(`🔄 Making request to: ${config.method?.toUpperCase()} ${config.url}`);
    
    const raw = localStorage.getItem("stockchef_auth");
    if (raw) {
        try {
            const auth = JSON.parse(raw) as StoredAuth;
            if (auth.token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${auth.token}`;
                console.log(`🔑 Token added to request`);
            }
        } catch (error) {
            console.warn("⚠️ Error parsing auth token:", error);
        }
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ Response success: ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.log(`❌ Response error: ${error.response?.status} ${error.config?.url}`);
        console.log(`❌ Error details: ${error.response?.data || error.message}`);
        
        // Redirect to login on 401
        if (error.response?.status === 401) {
            localStorage.removeItem("stockchef_auth");
            window.location.href = "/login";
        }
        
        return Promise.reject(error);
    }
);

// Interceptor para api original (mocks)
api.interceptors.request.use((config) => {
    const raw = localStorage.getItem("stockchef_auth");
    if (raw) {
        try {
            const auth = JSON.parse(raw) as StoredAuth;
            if (auth.token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${auth.token}`;
            }
        } catch {
            // ignore
        }
    }
    return config;
});
