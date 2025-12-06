import { createContext, useContext, useEffect, useState } from "react";

type Role = "USER" | "ADMIN";
type AuthState = { role: Role | null; token?: string | null };
type AuthContext = {
    auth: AuthState;
    login: (role: Role) => void;
    logout: () => void;
    hasRole: (...roles: Role[]) => boolean;
};

const Ctx = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuth] = useState<AuthState>(() => {
        const raw = localStorage.getItem("auth");
        return raw ? JSON.parse(raw) : { role: null, token: null };
    });

    useEffect(() => localStorage.setItem("auth", JSON.stringify(auth)), [auth]);

    const login = (role: Role) => setAuth({ role, token: "fake" });
    const logout = () => setAuth({ role: null, token: null });
    const hasRole = (...roles: Role[]) => !!auth.role && roles.includes(auth.role);

    return <Ctx.Provider value={{ auth, login, logout, hasRole }}>{children}</Ctx.Provider>;
}
export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("AuthProvider missing");
    return ctx;
}
