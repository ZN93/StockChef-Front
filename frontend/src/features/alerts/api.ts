import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";

export type AlertProduct = {
    id: number;
    nom: string;
    quantiteStock: number;
    unite: string;
    datePeremption: string;
    dateEntree: string;
    prixUnitaire: number;
    seuil: number;
    isUnderAlertThreshold?: boolean;
    isExpired?: boolean;
};

export type MenuAlert = {
    id: number;
    nom: string;
    prixVente: number;
    coutTotalIngredients: number;
    marge: number;
    statut: string;
    dateService: string;
};

export function useExpiredProducts() {
    return useQuery({
        queryKey: ["alerts", "expired"],
        queryFn: async (): Promise<AlertProduct[]> => {
            const { data } = await apiClient.get<AlertProduct[]>('/inventory/produits');
            
            const expired = data.filter(product => {
                const expDate = new Date(product.datePeremption);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return expDate < today;
            });
            
            return expired;
        },
        staleTime: 1 * 60 * 1000,
        refetchInterval: 2 * 60 * 1000, 
    });
}


export function useExpiringProducts() {
    return useQuery({
        queryKey: ["alerts", "expiring"],
        queryFn: async (): Promise<AlertProduct[]> => {
            const { data } = await apiClient.get<AlertProduct[]>('/inventory/produits/expiring');
            return data;
        },
        staleTime: 1 * 60 * 1000, 
        refetchInterval: 3 * 60 * 1000, 
    });
}

export function useStockAlerts() {
    return useQuery({
        queryKey: ["alerts", "stock"],
        queryFn: async (): Promise<AlertProduct[]> => {
            const { data } = await apiClient.get<AlertProduct[]>('/inventory/produits/alerts');
            return data;
        },
        staleTime: 2 * 60 * 1000, 
        refetchInterval: 5 * 60 * 1000,
    });
}


export function useMenuBudgetAlerts(seuilBudget: number = 15.0) {
    return useQuery({
        queryKey: ["alerts", "menu-budget", seuilBudget],
        queryFn: async (): Promise<MenuAlert[]> => {
            
            try {
                const { data } = await apiClient.get<{content: MenuAlert[]}>('/menus');
                
                const menusOverBudget = (data.content || []).filter(menu => {
                    const cout = menu.coutTotalIngredients || 0;
                    const prix = menu.prixVente || 0;
                    return cout > seuilBudget || (prix > 0 && cout > prix * 0.7); 
                });
                return menusOverBudget;
            } catch (error) {
                console.warn( error);
                return [];
            }
        },
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000, 
    });
}

export function formatDate(dateStr: string): string {
    try {
        return new Date(dateStr).toLocaleDateString("fr-FR");
    } catch {
        return dateStr;
    }
}

export function getDaysUntilExpiry(dateStr: string): number {
    const expDate = new Date(dateStr);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
}