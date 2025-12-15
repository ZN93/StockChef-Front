import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

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

export function useDashboardSummary() {
    return useQuery({
        queryKey: ["dashboard", "summary"],
        queryFn: async (): Promise<DashboardSummary> => {
            
            const { data } = await apiClient.get<DashboardSummary>('/inventory/produits/inventory-summary');
            
            return data;
        },
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000, 
    });
}

export function useProductsInAlert() {
    return useQuery({
        queryKey: ["dashboard", "alerts"],
        queryFn: async (): Promise<ProductAlert[]> => {
            const { data } = await apiClient.get<ProductAlert[]>('/inventory/produits/alerts');
            return data;
        },
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000, 
    });
}

export function useExpiringProducts(days: number = 7) {
    return useQuery({
        queryKey: ["dashboard", "expiring", days],
        queryFn: async (): Promise<ProductAlert[]> => {
           
            const { data } = await apiClient.get<ProductAlert[]>(`/inventory/produits/expiring?days=${days}`);
           
            return data;
        },
        staleTime: 1 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
    });
}

export function useRecentProducts(limit: number = 5) {
    return useQuery({
        queryKey: ["dashboard", "recent", limit],
        queryFn: async (): Promise<ProductAlert[]> => {
        
            const { data } = await apiClient.get<ProductAlert[]>('/inventory/produits');
        
            
            
            return data
                .sort((a, b) => new Date(b.dateEntree).getTime() - new Date(a.dateEntree).getTime())
                .slice(0, limit);
        },
        staleTime: 3 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000, 
    });
}


export function calculateDashboardKPIs(
    summary?: DashboardSummary,
    alerts?: ProductAlert[]
) {
    if (!summary) return null;


    const expired = summary.products.filter(p => {
        const expDate = new Date(p.datePeremption);
        return expDate < new Date();
    });

    const soonToExpire = summary.products.filter(p => {
        const expDate = new Date(p.datePeremption);
        const today = new Date();
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
    });

    const productsWithPrice = summary.products.filter(p => p.prixUnitaire);
    const averageCost = productsWithPrice.length > 0 
        ? productsWithPrice.reduce((sum, p) => sum + (p.prixUnitaire || 0), 0) / productsWithPrice.length
        : 0;

    const underThreshold = alerts?.length || summary.products.filter(p => p.isUnderAlertThreshold).length || 0;

    return {
        totalProducts: summary.totalProduits,
        expiredProducts: expired.length,
        soonToExpireProducts: soonToExpire.length,
        productsInAlert: underThreshold,
        averageCost,
        menusOverBudget: 0
    };
}