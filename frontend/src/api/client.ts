import axios from "axios";

/**
 * Client utilisé pour toutes les routes "métiers" (produits, menus, etc.).
 * En dev il pointe sur /api pour être intercepté par MSW (mocks),
 * donc aucune erreur CORS.
 */
export const api = axios.create({
    baseURL: "/api",
});

/**
 * Client dédié au backend Spring (authentification).
 * On passe par une autre instance pour ne pas casser les mocks.
 */
export const authApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8090/api",
});


type StoredAuth = {
    token?: string | null;
};

api.interceptors.request.use((config) => {
    const raw = localStorage.getItem("stockchef_auth");
    if (raw) {
        try {
            const auth = JSON.parse(raw) as StoredAuth;
            if (auth.token) {
                if (!config.headers) config.headers = {};
                (config.headers as any).Authorization = `Bearer ${auth.token}`;
            }
        } catch {
            // ignore
        }
    }
    return config;
});
