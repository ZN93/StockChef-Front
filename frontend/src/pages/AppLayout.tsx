import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AppLayout() {
    const { auth, logout, hasRole } = useAuth();

    const linkBase =
        "px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-colors lg:w-full lg:rounded-xl";
    const linkInactive =
        "text-gray-700 hover:bg-gray-100 hover:text-gray-900";
    const linkActive = "bg-gray-900 text-white";

    return (
<<<<<<< Updated upstream
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
=======
        <div className="min-h-screen bg-gray-50">
            {/* Topbar mobile */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b lg:hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
                    <div className="text-lg font-bold tracking-tight">StockChef App</div>
>>>>>>> Stashed changes

                    {/* Infos utilisateur + logout */}
                    <div className="flex items-center gap-3">
<<<<<<< Updated upstream
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
=======
                        <NavLink
                            to="/app/profile"
                            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700"
                        >
                            Profil
                        </NavLink>
>>>>>>> Stashed changes
                        <button
                            type="button"
                            onClick={logout}
                            className="text-xs sm:text-sm text-red-600 hover:text-red-700"
                        >
                            Se déconnecter
                        </button>
                    </div>
                </div>

                {/* Nav mobile (scroll horizontal) */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-3">
                    <nav className="flex gap-1 overflow-x-auto">
                        {/* tes NavLink ici (les mêmes) */}
                    </nav>
                </div>
            </header>

<<<<<<< Updated upstream
            {/* CONTENU PRINCIPAL */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Outlet/>
=======
            {/* Desktop layout: sidebar + main */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6">
                    {/* Sidebar desktop */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-6">
                            <div className="bg-white border rounded-2xl p-4 shadow-sm">
                                <div className="text-xl font-bold tracking-tight mb-4">
                                    StockChef App
                                </div>

                                <nav className="flex flex-col gap-1">
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

                                        {/* Rapports temporalmente deshabilitados - endpoints no funcionan (500 errors)
                                        {(hasRole("ADMIN") || hasRole("CHEF") || hasRole("DEVELOPER")) && (
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
                                        */}

                                        <NavLink
                                            to="/app/alertes"
                                            className={({isActive}) =>
                                                `${linkBase} ${isActive ? linkActive : linkInactive}`
                                            }
                                        >
                                            Alertes
                                        </NavLink>

                                        {canManageUsers() && (
                                            <NavLink
                                                to="/app/usuarios"
                                                className={({isActive}) =>
                                                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                                                }
                                            >
                                                Usuarios
                                            </NavLink>
                                        )}
                                    </div>
                                </nav>

                                <div className="mt-6 pt-4 border-t">
                                    <div className="text-sm text-gray-700 font-medium">
                                        {auth?.role ?? "?"}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Connecté : {auth?.role}
                                    </div>

                                    <div className="mt-3 flex items-center gap-3">
                                        <NavLink
                                            to="/app/profile"
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            Profil
                                        </NavLink>
                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            Se déconnecter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="min-w-0">
                        <Outlet />
                    </main>
>>>>>>> Stashed changes
                </div>
            </div>
        </div>
    );
}
