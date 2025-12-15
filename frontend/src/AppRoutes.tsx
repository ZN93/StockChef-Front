import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RouteGuard from "./auth/RouteGuard";
import LoginPage from "./pages/Login.tsx";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UsersPage from "./pages/UsersPage";
import AppLayout from "./pages/AppLayout";
import ProduitsPage from "./pages/produits/ProduitsPage";
import MenusPage from "./pages/menus/MenusPage";
import AlertesPage from "./pages/AlertesPage";
import RapportsPage from "./pages/RapportsPage";
import DashboardPage from "./pages/DashboardPage.tsx";

const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <Register /> },
    {
        path: "/app",
        element: <RouteGuard />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { index: true, element: <DashboardPage /> }, // page par défaut
                    { path: "produits", element: <ProduitsPage /> },
                    { path: "menus", element: <MenusPage /> },
                    { path: "alertes", element: <AlertesPage /> },
                    { path: "rapports", element: <RapportsPage /> }, // RouteGuard + hasRole feront le reste
                    { path: "profile", element: <Profile /> },
                    { path: "usuarios", element: <UsersPage /> },
                ],
            },
        ],
    },
    { path: "*", element: <LoginPage /> },
]);

export default function AppRoutes() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}
