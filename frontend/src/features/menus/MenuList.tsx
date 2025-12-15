import { useState } from "react";
import { useMenus, useMenusRealisables } from "./api";
import EditMenuModal from "./EditMenuModal";
import DeleteMenuModal from "./DeleteMenuModal";
import MenuActionsModal from "./MenuActionsModal";
import type { Menu } from "./types";

type Props = { seuilBudget?: number };

const formatEUR = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

const formatDate = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleDateString("fr-FR");
    } catch {
        return dateStr;
    }
};

export default function MenuList({ seuilBudget = 15 }: Props) {
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [actionsModalOpen, setActionsModalOpen] = useState(false);

    const [viewMode, setViewMode] = useState<"all" | "realizable">("all");
    const [selectedDate, setSelectedDate] = useState<string>("");

    const { data: allMenus, isLoading: isLoadingAll, isError: isErrorAll } = useMenus({ page: 0, size: 20 });
    const { data: realizableMenus, isLoading: isLoadingRealizable } = useMenusRealisables(selectedDate);

    const getCurrentData = () => {
        switch (viewMode) {
            case "realizable":
                return { content: realizableMenus || [], totalElements: realizableMenus?.length || 0 };
            default:
                return allMenus || { content: [], totalElements: 0 };
        }
    };

    const currentData = getCurrentData();
    const isLoading = isLoadingAll || (viewMode === "realizable" && isLoadingRealizable);
    const isError = isErrorAll;

    const handleDateFilter = (date: string) => {
        setSelectedDate(date);
        setViewMode(date ? "realizable" : "all");
    };

    const handleClearFilters = () => {
        setSelectedDate("");
        setViewMode("all");
    };

    if (isLoading) return <div className="text-center py-4">Chargement des menus…</div>;
    if (isError) return <div className="text-center py-4 text-red-600">Erreur lors du chargement des menus</div>;

    const rows = currentData.content ?? [];
    if (rows.length === 0) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">Gestión de Menús</h1>
                            <p className="text-gray-600 mt-1">No hay menús disponibles</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => handleDateFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    title="Filtrar menús realizables por fecha"
                                />
                                
                                {selectedDate && (
                                    <button
                                        onClick={handleClearFilters}
                                        className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        title="Limpiar filtros"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center text-gray-500 py-6">Aucun menu</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">Gestión de Menús</h1>
                        <p className="text-gray-600 mt-1">
                            Encontrados {currentData.totalElements} menús
                            {viewMode === "realizable" && ` realizables para ${selectedDate}`}
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => handleDateFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                title="Filtrar menús realizables por fecha"
                            />
                            
                            {selectedDate && (
                                <button
                                    onClick={handleClearFilters}
                                    className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    title="Limpiar filtros"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Menús ({rows.length})</h2>
                        <div className="text-sm text-gray-500">
                            Total: {currentData.totalElements || 0} menus
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse bg-white rounded-lg shadow">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Nom</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Date service</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Prix vente</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Coût ingrédients</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Marge</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Ingrédients</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {rows.map((menu) => {
                        const coutIngredients = menu.coutTotalIngredients || 0;
                        const prixVente = menu.prixVente || 0;
                        const marge = menu.marge || 0;
                        const margePercentage = menu.margePercentage || 0;
                        
                        const depasse = prixVente > 0 && coutIngredients > seuilBudget;
                        
                        const statutBadge = {
                            BROUILLON: "bg-gray-100 text-gray-800",
                            CONFIRME: "bg-blue-100 text-blue-800", 
                            REALISE: "bg-green-100 text-green-800",
                            ANNULE: "bg-red-100 text-red-800"
                        }[menu.statut] || "bg-gray-100 text-gray-800";
                        
                        const rowClassName = depasse ? "bg-red-50 border-l-4 border-red-400" : "";

                        return (
                            <tr key={menu.id} className={`border-t hover:bg-gray-50 ${rowClassName}`}>
                                <td className="py-3 px-4 font-medium">{menu.nom}</td>
                                <td className="py-3 px-4">{formatDate(menu.dateService)}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statutBadge}`}>
                                        {menu.statut}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    {prixVente > 0 ? formatEUR(prixVente) : "—"}
                                </td>
                                <td className="py-3 px-4">
                                    {coutIngredients > 0 ? formatEUR(coutIngredients) : "—"}
                                </td>
                                <td className="py-3 px-4">
                                    {marge > 0 ? (
                                        <div>
                                            <div>{formatEUR(marge)}</div>
                                            {margePercentage > 0 && (
                                                <div className="text-xs text-gray-500">
                                                    ({margePercentage.toFixed(1)}%)
                                                </div>
                                            )}
                                        </div>
                                    ) : "—"}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="max-w-xs">
                                        {menu.nombreIngredients > 0 ? (
                                            <>
                                                <span className="text-sm font-medium">{menu.nombreIngredients} ingrédient{menu.nombreIngredients > 1 ? 's' : ''}</span>
                                                {menu.nombreIngredientsManquants > 0 && (
                                                    <div className="text-red-600 text-xs">
                                                        {menu.nombreIngredientsManquants} manquant{menu.nombreIngredientsManquants > 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Aucun ingrédient</span>
                                        )}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => {
                                                setSelectedMenu(menu);
                                                setEditModalOpen(true);
                                            }}
                                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                            title="Modifier"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedMenu(menu);
                                                setActionsModalOpen(true);
                                            }}
                                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                            title="Actions"
                                        >
                                            ⚡
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedMenu(menu);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                </div>
            </div>
            
            {currentData?.totalElements && currentData.totalElements > 20 && (
                <div className="mt-4 text-sm text-gray-600 text-center bg-white rounded-lg border border-gray-200 p-4">
                    Mostrando {Math.min(20, rows.length)} de {currentData.totalElements} menús
                    {viewMode === "realizable" && ` realizables para ${selectedDate}`}
                </div>
            )}

            <EditMenuModal 
                menuId={selectedMenu?.id || 0}
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedMenu(null);
                }}
            />
            
            <MenuActionsModal 
                menu={selectedMenu}
                isOpen={actionsModalOpen}
                onClose={() => {
                    setActionsModalOpen(false);
                    setSelectedMenu(null);
                }}
            />
            
            <DeleteMenuModal 
                menu={selectedMenu}
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setSelectedMenu(null);
                }}
            />
        </div>
    );
}