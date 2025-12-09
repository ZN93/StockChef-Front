import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AppLayout() {
    const { auth, logout, hasRole } = useAuth();

    const linkBase =
        "px-3 py-2 rounded-full text-sm whitespace-nowrap transition-colors";
    const linkInactive =
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
    const linkActive = "bg-gray-900 text-white";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* NAVBAR HAUT */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                    {/* Logo / titre */}
                    <div className="text-lg sm:text-xl font-bold tracking-tight">
                        La Cantinière
                    </div>

                    {/* Liens de navigation */}
                    <nav className="flex-1 flex justify-center">
                        <div className="flex gap-1 overflow-x-auto">
                            <NavLink
                                to="/app"
                                end
                                className={({isActive}) =>
                                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                                }
                            >
                                Tableau de bord
                            </NavLink>

                            {/* Tout le monde voit Produits */}
                            <NavLink
                                to="/app/produits"
                                className={({isActive}) =>
                                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                                }
                            >
                                Produits
                            </NavLink>

                            <NavLink
                                to="/app/menus"
                                className={({isActive}) =>
                                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                                }
                            >
                                Menus
                            </NavLink>

                            {/* Menus + Rapports réservés ADMIN */}
                            {hasRole("ADMIN") && (
                                <>
                                    <NavLink
                                        to="/app/rapports"
                                        className={({isActive}) =>
                                            `${linkBase} ${isActive ? linkActive : linkInactive}`
                                        }
                                    >
                                        Rapports
                                    </NavLink>
                                </>
                            )}

                            {/* Alertes pour tout le monde */}
                            <NavLink
                                to="/app/alertes"
                                className={({isActive}) =>
                                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                                }
                            >
                                Alertes
                            </NavLink>
                        </div>
                    </nav>

                    {/* Infos utilisateur + logout */}
                    <div className="flex items-center gap-3">
                        <div className="text-xs sm:text-sm text-gray-600 text-right">
                            <div className="font-medium">
                                {auth?.role ?? "?"}
                                {hasRole("ADMIN") && (
                                    <span
                                        className="ml-1 inline-flex items-center rounded-full bg-gray-900/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-700">
                    Admin
                  </span>
                                )}
                            </div>
                            <div className="text-[11px] text-gray-500">
                                Connecté : {auth?.role}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={logout}
                            className="text-xs sm:text-sm text-red-600 hover:text-red-700"
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </header>

            {/* CONTENU PRINCIPAL */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
}
