import type { SimpleRole } from "./roles.ts";

export type AuthState = {
    token: string | null;
    email: string | null;
    fullName: string | null;
    role: SimpleRole | null;
};

export type AuthContextValue = {
    auth: AuthState;
    user: AuthState;
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
