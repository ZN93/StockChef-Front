import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RouteGuard({ roles }: { roles?: Array<"USER"|"ADMIN"|"CHEF"|"EMPLOYEE"|"DEVELOPER"> }) {
    const { auth, hasRole } = useAuth();

    if (!auth) return <Navigate to="/login" replace />;

    if (roles && !hasRole(...roles)) {
        return <Navigate to="/app" replace />;
    }

    return <Outlet />;
}

