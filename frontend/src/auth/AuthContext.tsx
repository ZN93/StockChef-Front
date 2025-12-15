import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import type { ReactNode } from "react";
import { loginApi } from "./api";
import type { LoginResponse } from "./api";

type SimpleRole = "ADMIN" | "USER" | "DEVELOPER" | "CHEF" | "EMPLOYEE";

type AuthState = {
    token: string | null;
    email: string | null;
    fullName: string | null;
    role: SimpleRole | null;
};

type AuthContextValue = {
    auth: AuthState;
    user: AuthState; // Alias para compatibilidad
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    hasRole: (...roles: SimpleRole[]) => boolean;
    isAdmin: () => boolean;
    isChef: () => boolean;
    isDeveloper: () => boolean;
    canManageInventory: () => boolean;
    canManageMenus: () => boolean;
    canManageUsers: () => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "stockchef_auth";

function mapBackendRole(role: string): SimpleRole {
    if (role === "ROLE_ADMIN") return "ADMIN";
    if (role === "ROLE_DEVELOPER") return "DEVELOPER";
    if (role === "ROLE_CHEF") return "CHEF";
    if (role === "ROLE_EMPLOYEE") return "EMPLOYEE";
    return "USER";
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [auth, setAuth] = useState<AuthState>(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { token: null, email: null, fullName: null, role: null };
        try {
            return JSON.parse(raw) as AuthState;
        } catch {
            return { token: null, email: null, fullName: null, role: null };
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    }, [auth]);

    const login = useCallback(async (email: string, password: string) => {
        const data: LoginResponse = await loginApi({ email, password });

        const mappedRole = mapBackendRole(data.role);

        setAuth({
            token: data.token,
            email: data.email,
            fullName: data.fullName,
            role: mappedRole,
        });
    }, []);

    const logout = useCallback(() => {
        setAuth({ token: null, email: null, fullName: null, role: null });
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const hasRole = useCallback(
        (...roles: SimpleRole[]) => {
            if (!auth.role) return false;
            return roles.includes(auth.role);
        },
        [auth.role]
    );

    // Role-specific helper functions
    const isAdmin = useCallback(() => hasRole("ADMIN"), [hasRole]);
    const isChef = useCallback(() => hasRole("CHEF"), [hasRole]);
    const isDeveloper = useCallback(() => hasRole("DEVELOPER"), [hasRole]);

    // Permission helper functions
    const canManageInventory = useCallback(
        () => hasRole("DEVELOPER", "ADMIN", "CHEF"),
        [hasRole]
    );

    const canManageMenus = useCallback(
        () => hasRole("DEVELOPER", "ADMIN", "CHEF"),
        [hasRole]
    );

    const canManageUsers = useCallback(
        () => hasRole("DEVELOPER", "ADMIN"),
        [hasRole]
    );

    return (
        <AuthContext.Provider value={{ 
            auth, 
            user: auth, // Alias para compatibilidad
            login, 
            logout, 
            hasRole,
            isAdmin,
            isChef,
            isDeveloper,
            canManageInventory,
            canManageMenus,
            canManageUsers
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
