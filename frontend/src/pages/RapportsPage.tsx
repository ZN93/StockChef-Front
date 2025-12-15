import SectionCard from "../ui/SectionCard.tsx";
import { Chip } from "../ui/Chip.tsx";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuth } from "../auth/useAuth";

// Tipos para los datos reales de la API
type InventorySummary = {
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    expiringCount: number;
    categories: {
        [key: string]: {
            count: number;
            value: number;
        };
    };
};

type ReportProduct = {
    id: number;
    nom: string;
    quantiteStock: number;
    unite: string;
    prixUnitaire: number;
    datePeremption: string;
    isUnderAlertThreshold: boolean;
};

type DashboardData = {
    message: string;
    timestamp: string;
};

// Petit helper pour l'affichage des montants
const formatEUR = (n: number | undefined) =>
    new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(n ?? 0);

// Hooks para obtener datos reales
const useInventorySummary = () => {
    return useQuery({
        queryKey: ['reports', 'inventory-summary'],
        queryFn: async (): Promise<InventorySummary> => {
            const { data } = await apiClient.get('/reports/inventory-summary');
            return data;
        },
        retry: 1
    });
};

const useAllProducts = () => {
    return useQuery({
        queryKey: ['reports', 'all-products'],
        queryFn: async (): Promise<ReportProduct[]> => {
            const { data } = await apiClient.get('/reports/all-products');
            return data;
        },
        retry: 1
    });
};

const useDashboardReport = () => {
    return useQuery({
        queryKey: ['reports', 'dashboard'],
        queryFn: async (): Promise<DashboardData> => {
            const { data } = await apiClient.get('/reports/dashboard');
            return data;
        },
        retry: 1
    });
};

export default function RapportsPage() {
    const { canManageInventory } = useAuth();
    
    // Obtener datos reales de la API
    const { data: inventorySummary, isLoading: isInventoryLoading, isError: isInventoryError } = useInventorySummary();
    const { data: allProducts, isLoading: isProductsLoading, isError: isProductsError } = useAllProducts();
    const { data: dashboardData, isLoading: isDashboardLoading, isError: isDashboardError } = useDashboardReport();

    // Si el usuario no tiene permisos, no mostrar la página
    if (!canManageInventory()) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">Accès restreint</h2>
                    <p className="text-gray-500">Vous n'avez pas les permissions nécessaires pour accéder aux rapports.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
            {/* ----------------- Resumen de Inventario ----------------- */}
            <SectionCard title="Resumen de Inventario">
                {isInventoryLoading && <div className="text-sm text-gray-500">Cargando...</div>}
                {isInventoryError && (
                    <div className="text-sm text-red-600">
                        Error al cargar el resumen de inventario.
                    </div>
                )}

                {!isInventoryLoading && !isInventoryError && inventorySummary && (
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span>Total de productos</span>
                            <strong>{inventorySummary.totalProducts}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Valor total</span>
                            <strong>{formatEUR(inventorySummary.totalValue)}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Productos con stock bajo</span>
                            <strong className="text-orange-600">{inventorySummary.lowStockCount}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Productos próximos a vencer</span>
                            <strong className="text-red-600">{inventorySummary.expiringCount}</strong>
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* ----------------- Estado del Sistema ----------------- */}
            <SectionCard title="Estado del Sistema">
                {isDashboardLoading && <div className="text-sm text-gray-500">Cargando...</div>}
                {isDashboardError && (
                    <div className="text-sm text-red-600">
                        Error al cargar el estado del sistema.
                    </div>
                )}

                {!isDashboardLoading && !isDashboardError && dashboardData && (
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span>Estado</span>
                            <Chip type="success">Operativo</Chip>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Última actualización</span>
                            <span className="text-xs text-gray-500">
                                {new Date(dashboardData.timestamp).toLocaleString('es-ES')}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            {dashboardData.message}
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* ----------------- Productos por Categoría ----------------- */}
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
                            <div key={category} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
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

            {/* ----------------- Lista de Productos Críticos ----------------- */}
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
                                <th>Stock</th>
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
                                            <td className="py-2">
                                                <div className="font-medium">{product.nom}</div>
                                                <div className="text-xs text-gray-500">
                                                    Vence: {new Date(product.datePeremption).toLocaleDateString('es-ES')}
                                                </div>
                                            </td>
                                            <td>
                                                <div>{product.quantiteStock} {product.unite}</div>
                                                <div className="text-xs text-gray-500">{formatEUR(product.prixUnitaire)}</div>
                                            </td>
                                            <td>
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

            {/* ----------------- Estadísticas Rápidas ----------------- */}
            <SectionCard title="Estadísticas Rápidas">
                {(isInventoryLoading || isProductsLoading) && <div className="text-sm text-gray-500">Cargando...</div>}
                {(isInventoryError || isProductsError) && (
                    <div className="text-sm text-red-600">
                        Error al cargar las estadísticas.
                    </div>
                )}

                {!isInventoryLoading && !isProductsLoading && !isInventoryError && !isProductsError && inventorySummary && allProducts && (
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span>Productos registrados</span>
                            <strong>{inventorySummary.totalProducts}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Valor promedio por producto</span>
                            <strong>{formatEUR(inventorySummary.totalValue / inventorySummary.totalProducts)}</strong>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>% Productos críticos</span>
                            <strong className="text-orange-600">
                                {((inventorySummary.lowStockCount + inventorySummary.expiringCount) / inventorySummary.totalProducts * 100).toFixed(1)}%
                            </strong>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Categorías activas</span>
                            <strong>{Object.keys(inventorySummary.categories || {}).length}</strong>
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* ----------------- Acciones ----------------- */}
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
                            const data = { inventorySummary, allProducts, dashboardData };
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
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
    );
}