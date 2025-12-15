import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

// Types pour le dashboard
export type DashboardSummary = {
    status: string;
    totalProduits: number;
    message: string;
    timestamp: string;
    products: Array<{
        id: number;
        nom: string;
        quantiteStock: number;
        unite: string;
        datePeremption: string;
        seuil: number;
        prixUnitaire?: number;
        dateEntree?: string;
        isExpired?: boolean;
        isUnderAlertThreshold?: boolean;
    }>;
};

export type ProductAlert = {
    id: number;
    nom: string;
    quantiteStock: number;
    unite: string;
    seuil: number;
    prixUnitaire: number;
    dateEntree: string;
    datePeremption: string;
    isUnderAlertThreshold: boolean;
};

// Hook pour le résumé du dashboard
export function useDashboardSummary() {
    return useQuery({
        queryKey: ["dashboard", "summary"],
        queryFn: async (): Promise<DashboardSummary> => {
            console.log('📊 Fetching dashboard summary...');
            const { data } = await apiClient.get<DashboardSummary>('/inventory/produits/inventory-summary');
            console.log('✅ Dashboard summary:', data);
            return data;
        },
        staleTime: 2 * 60 * 1000, // 2 minutos
        refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
    });
}

// Hook pour les produits en alerte
export function useProductsInAlert() {
    return useQuery({
        queryKey: ["dashboard", "alerts"],
        queryFn: async (): Promise<ProductAlert[]> => {
            console.log('⚠️ Fetching products in alert...');
            const { data } = await apiClient.get<ProductAlert[]>('/inventory/produits/alerts');
            console.log('✅ Products in alert:', data.length);
            return data;
        },
        staleTime: 2 * 60 * 1000, // 2 minutos
        refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
    });
}

// Hook pour les produits expirant bientôt
export function useExpiringProducts(days: number = 7) {
    return useQuery({
        queryKey: ["dashboard", "expiring", days],
        queryFn: async (): Promise<ProductAlert[]> => {
            console.log(`⏰ Fetching products expiring in ${days} days...`);
            const { data } = await apiClient.get<ProductAlert[]>(`/inventory/produits/expiring?days=${days}`);
            console.log('✅ Expiring products:', data.length);
            return data;
        },
        staleTime: 1 * 60 * 1000, // 1 minuto (más frecuente para fechas)
        refetchInterval: 5 * 60 * 1000,
    });
}

// Hook pour les derniers produits entrés
export function useRecentProducts(limit: number = 5) {
    return useQuery({
        queryKey: ["dashboard", "recent", limit],
        queryFn: async (): Promise<ProductAlert[]> => {
            console.log(`📦 Fetching ${limit} recent products...`);
            const { data } = await apiClient.get<ProductAlert[]>('/inventory/produits');
            console.log('✅ Recent products:', data.length);
            
            // Trier par date d'entrée et prendre les plus récents
            return data
                .sort((a, b) => new Date(b.dateEntree).getTime() - new Date(a.dateEntree).getTime())
                .slice(0, limit);
        },
        staleTime: 3 * 60 * 1000, // 3 minutos
        refetchInterval: 10 * 60 * 1000, // Refrescar cada 10 minutos
    });
}

// Fonction utilitaire pour calculer les KPIs
export function calculateDashboardKPIs(
    summary?: DashboardSummary,
    alerts?: ProductAlert[]
) {
    if (!summary) return null;

    // Calcular productos expirados
    const expired = summary.products.filter(p => {
        const expDate = new Date(p.datePeremption);
        return expDate < new Date();
    });

    // Calcular productos próximos a expirar (3 días)
    const soonToExpire = summary.products.filter(p => {
        const expDate = new Date(p.datePeremption);
        const today = new Date();
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
    });

    // Calcular costo promedio (estimado basado en precios disponibles)
    const productsWithPrice = summary.products.filter(p => p.prixUnitaire);
    const averageCost = productsWithPrice.length > 0 
        ? productsWithPrice.reduce((sum, p) => sum + (p.prixUnitaire || 0), 0) / productsWithPrice.length
        : 0;

    // Productos en alerta (bajo seuil)
    const underThreshold = alerts?.length || summary.products.filter(p => p.isUnderAlertThreshold).length || 0;

    return {
        totalProducts: summary.totalProduits,
        expiredProducts: expired.length,
        soonToExpireProducts: soonToExpire.length,
        productsInAlert: underThreshold,
        averageCost,
        // Para menús > seuil necesitaremos datos de menús (implementar después)
        menusOverBudget: 0
    };
}