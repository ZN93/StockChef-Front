import React from "react";
import { useAuth } from "../auth/useAuth";

interface RoleGuardProps {
    roles: Array<"ADMIN" | "DEVELOPER" | "CHEF" | "EMPLOYEE">;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
    const { hasRole } = useAuth();
    
    if (hasRole(...roles)) {
        return <>{children}</>;
    }
    
    return <>{fallback}</>;
}

interface PermissionGuardProps {
    permission: "canManageInventory" | "canManageMenus" | "canManageUsers";
    children: React.ReactNode;
    fallback?: React.ReactNode;
}


export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
    const auth = useAuth();
    
    if (auth[permission]()) {
        return <>{children}</>;
    }
    
    return <>{fallback}</>;
}

interface ReadOnlyGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function ReadOnlyGuard({ children, fallback = null }: ReadOnlyGuardProps) {
    const { hasRole } = useAuth();
    
    if (!hasRole("EMPLOYEE")) {
        return <>{children}</>;
    }
    
    return <>{fallback}</>;
}

export default RoleGuard;