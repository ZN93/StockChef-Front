import { useState } from "react";
import SectionCard from "../ui/SectionCard.tsx";
import { Chip } from "../ui/Chip.tsx";
import { useRapports } from "../features/rapports/api"; // ← hook FW5

// Petit helper pour l’affichage des montants
const formatEUR = (n: number | undefined) =>
    new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(n ?? 0);

export default function RapportsPage() {
    // valeurs par défaut : depuis le 1er janvier de l’année courante jusqu’à aujourd’hui
    const now = new Date();
    const currentYear = now.getFullYear();
    const defaultFrom = `${currentYear}-01-01`;
    const defaultTo = now.toISOString().slice(0, 10);

    const [fromInput, setFromInput] = useState(defaultFrom);
    const [toInput, setToInput] = useState(defaultTo);

    // Filtres réellement utilisés pour l’appel API
    const [filters, setFilters] = useState<{ from: string; to: string }>({
        from: defaultFrom,
        to: defaultTo,
    });

    const { data, isLoading, isError } = useRapports({
        from: filters.from,
        to: filters.to,
    });

    const handleGenerate = () => {
        if (!fromInput || !toInput) return;
        // on pourrait ajouter un contrôle from <= to ici
        setFilters({ from: fromInput, to: toInput });
    };

    const handleExport = () => {
        // mock d’export
        // tu pourras plus tard remplacer par un vrai appel API/bibliothèque PDF
        console.log("Export PDF (mock) pour", filters);
        alert("Export PDF (mock) – à implémenter plus tard 😉");
    };

    const coutMoyen = data?.coutMoyen;
    const nbDepassements = data?.nbDepassements;

    return (
<<<<<<< Updated upstream
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
            {/* ----------------- Filtre période ----------------- */}
            <SectionCard title="Filtre période">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <label className="flex flex-col gap-1">
                        <span className="text-gray-500">Du</span>
                        <input
                            type="date"
                            value={fromInput}
                            onChange={(e) => setFromInput(e.target.value)}
                            className="px-3 py-2 border rounded-xl focus:outline-none focus:ring w-full"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-gray-500">Au</span>
                        <input
                            type="date"
                            value={toInput}
                            onChange={(e) => setToInput(e.target.value)}
                            className="px-3 py-2 border rounded-xl focus:outline-none focus:ring w-full"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={handleGenerate}
                        className="px-3 py-2 rounded-xl bg-black text-white text-sm mt-1"
                    >
                        Générer
                    </button>

                    <button
                        type="button"
                        onClick={handleExport}
                        className="px-3 py-2 rounded-xl border text-sm mt-1"
                    >
                        Exporter PDF
                    </button>

                    <div className="md:col-span-2 text-xs text-gray-500 mt-1">
                        Période active :{" "}
                        <span className="font-medium">
              {filters.from} → {filters.to}
            </span>
                    </div>
                </div>
            </SectionCard>

            {/* ----------------- Synthèse coûts ----------------- */}
            <SectionCard title="Synthèse coûts">
                {isLoading && <div className="text-sm text-gray-500">Chargement…</div>}
                {isError && (
=======
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <SectionCard title="Resumen de Inventario">
                {isInventoryLoading && <div className="text-sm text-gray-500">Cargando...</div>}
                {isInventoryError && (
>>>>>>> Stashed changes
                    <div className="text-sm text-red-600">
                        Erreur lors du chargement des rapports.
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="space-y-3 text-sm">
<<<<<<< Updated upstream
                        <div className="flex items-center justify-between">
                            <span>Coût moyen</span>
                            <strong>{coutMoyen != null ? formatEUR(coutMoyen) : "—"}</strong>
                        </div>

                        <div className="flex items-center justify-between">
                            <span>Menus au-dessus du seuil</span>
                            <strong>{nbDepassements ?? "—"}</strong>
                        </div>

                        <div className="flex items-center justify-between">
                            <span>Période analysée</span>
                            <strong>
                                {filters.from} → {filters.to}
                            </strong>
                        </div>
=======
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span>Total de productos</span>
                            <strong>{inventorySummary.totalProducts}</strong>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span>Valor total</span>
                            <strong>{formatEUR(inventorySummary.totalValue)}</strong>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span>Productos con stock bajo</span>
                            <strong className="text-orange-600">{inventorySummary.lowStockCount}</strong>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span>Productos próximos a vencer</span>
                            <strong className="text-red-600">{inventorySummary.expiringCount}</strong>
                        </div>
                    </div>
                )}
            </SectionCard>

            <SectionCard title="Estado del Sistema">
                {isDashboardLoading && <div className="text-sm text-gray-500">Cargando...</div>}
                {isDashboardError && (
                    <div className="text-sm text-red-600">
                        Error al cargar el estado del sistema.
                    </div>
                )}

                {!isDashboardLoading && !isDashboardError && dashboardData && (
                    <div className="space-y-3 text-sm">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span>Estado</span>
                            <Chip type="success">Operativo</Chip>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span>Última actualización</span>
                            <span className="text-xs text-gray-500 break-words text-right sm:text-left">
                              {new Date(dashboardData.timestamp).toLocaleString("fr-FR")}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            {dashboardData.message}
                        </div>
                    </div>
                )}
            </SectionCard>

            <SectionCard title="Análisis por Categorías">
                {isInventoryLoading && <div className="text-sm text-gray-500">Cargando...</div>}
                {isInventoryError && (
                    <div className="text-sm text-red-600">
                        Error al cargar las categorías.
                    </div>
                )}

                {!isInventoryLoading && !isInventoryError && inventorySummary?.categories && (
                    <div className="space-y-2 text-sm">
                        {Object.entries(inventorySummary.categories).map(([category, data]) => (
                            <div key={category}
                                 className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                                <span className="capitalize">{category.toLowerCase()}</span>
                                <div className="text-right">
                                    <div className="font-medium">{data.count} productos</div>
                                    <div className="text-xs text-gray-500">{formatEUR(data.value)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isInventoryLoading && !isInventoryError && !inventorySummary?.categories && (
                    <div className="text-sm text-gray-400 text-center py-4">
                        No hay datos de categorías disponibles
                    </div>
                )}
            </SectionCard>

            <div className="lg:col-span-2">
                <SectionCard title="Productos Críticos">
                    {isProductsLoading && <div className="text-sm text-gray-500">Cargando...</div>}
                    {isProductsError && (
                        <div className="text-sm text-red-600">
                            Error al cargar los productos.
                        </div>
                    )}

                    {!isProductsLoading && !isProductsError && allProducts && (
                        <div className="overflow-x-auto text-sm max-h-64 overflow-y-auto">
                            <table className="w-full">
                                <thead className="text-left text-gray-500 sticky top-0 bg-white">
                                <tr>
                                    <th className="py-2">Producto</th>
                                    <th className="hidden sm:table-cell">Stock</th>
                                    <th>Estado</th>
                                </tr>
                                </thead>
                                <tbody>
                                {allProducts
                                    .filter(product => product.isUnderAlertThreshold || new Date(product.datePeremption) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
                                    .slice(0, 10)
                                    .map(product => {
                                        const isExpiringSoon = new Date(product.datePeremption) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                                        return (
                                            <tr key={product.id} className="border-t">
                                                <td className="py-2 max-w-[220px] sm:max-w-none">
                                                    <div className="font-medium break-words">{product.nom}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Vence: {new Date(product.datePeremption).toLocaleDateString('es-ES')}
                                                    </div>
                                                </td>
                                                <td>
                                                <div>{product.quantiteStock} {product.unite}</div>
                                                    <div
                                                        className="text-xs text-gray-500">{formatEUR(product.prixUnitaire)}</div>
                                                </td>
                                                <td className="hidden sm:table-cell">
                                                    {product.isUnderAlertThreshold ? (
                                                        <Chip type="warn">Stock Bajo</Chip>
                                                    ) : isExpiringSoon ? (
                                                        <Chip type="warn">Vence Pronto</Chip>
                                                    ) : (
                                                        <Chip type="success">OK</Chip>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {allProducts.filter(p => p.isUnderAlertThreshold || new Date(p.datePeremption) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length === 0 && (
                                <div className="text-center text-gray-400 py-4">
                                    No hay productos críticos
                                </div>
                            )}
                        </div>
                    )}
                </SectionCard>
            </div>

            <SectionCard title="Estadísticas Rápidas">
                {(isInventoryLoading || isProductsLoading) && <div className="text-sm text-gray-500">Cargando...</div>}
                {(isInventoryError || isProductsError) && (
                    <div className="text-sm text-red-600">
                        Error al cargar las estadísticas.
                    </div>
                )}

                {!isInventoryLoading && !isProductsLoading && !isInventoryError && !isProductsError && inventorySummary && allProducts && (
                    <div className="space-y-3 text-sm">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span>Productos registrados</span>
                            <strong>{inventorySummary.totalProducts}</strong>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span>Valor promedio por producto</span>
                            <strong>
                                {formatEUR(
                                    inventorySummary.totalProducts
                                        ? inventorySummary.totalValue / inventorySummary.totalProducts
                                        : 0
                                    )
                                }
                            </strong>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span>% Productos críticos</span>
                            <strong className="text-orange-600">
                                {((inventorySummary.lowStockCount + inventorySummary.expiringCount) / inventorySummary.totalProducts * 100).toFixed(1)}%
                            </strong>
                        </div>
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <span>Categorías activas</span>
                            <strong>{Object.keys(inventorySummary.categories || {}).length}</strong>
                        </div>
>>>>>>> Stashed changes
                    </div>
                )}
            </SectionCard>

<<<<<<< Updated upstream
            {/* ----------------- Graphiques (maquette) ----------------- */}
            <SectionCard title="Graphiques (mock)">
                <div className="h-48 grid place-items-center text-gray-400 text-sm">
                    [Courbes placeholder]
                </div>
            </SectionCard>

            {/* ----------------- Détail des menus (période) ----------------- */}
            <SectionCard title="Détail des menus (période)">
                <div className="overflow-x-auto text-sm">
                    <table className="w-full">
                        <thead className="text-left text-gray-500">
                        <tr>
                            <th className="py-2">Date</th>
                            <th>Nom</th>
                            <th>Coût total</th>
                            <th>Statut budget</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Pour l’instant : données de maquette statiques.
                 Tu pourras plus tard les rendre dynamiques si ton backend renvoie la liste détaillée. */}
                        <tr className="border-t">
                            <td className="py-2">2025-09-01</td>
                            <td>Menu Économique</td>
                            <td>{formatEUR(3.2)}</td>
                            <td>
                                <Chip type="success">OK</Chip>
                            </td>
                        </tr>
                        <tr className="border-t">
                            <td className="py-2">2025-09-02</td>
                            <td>Repas Luxueux</td>
                            <td>{formatEUR(5.5)}</td>
                            <td>
                                <Chip type="warn">Seuil</Chip>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </SectionCard>
=======
            <div className="lg:col-span-1">
                <SectionCard title="Acciones">
                    <div className="space-y-2">
                        <button
                            className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            onClick={() => window.print()}
                        >
                            Imprimir Reporte
                        </button>
                        <button
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            onClick={() => {
                                const data = {inventorySummary, allProducts, dashboardData};
                                const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `reporte-${new Date().toISOString().slice(0, 10)}.json`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url);
                            }}
                        >
                            Exportar JSON
                        </button>
                    </div>
                </SectionCard>
            </div>
>>>>>>> Stashed changes
        </div>
    );
}
