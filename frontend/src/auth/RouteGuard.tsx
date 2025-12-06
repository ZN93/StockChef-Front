import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RouteGuard({ roles }: { roles?: Array<"USER"|"ADMIN"> }) {
    const { auth, hasRole } = useAuth();
    if (!auth.role) return <Navigate to="/login" replace />;
    if (roles && !hasRole(...roles)) return <Navigate to="/app" replace />;
    return <Outlet />;
}
