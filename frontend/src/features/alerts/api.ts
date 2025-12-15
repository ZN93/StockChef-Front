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

// Hook pour les produits périmés
export function useExpiredProducts() {
    return useQuery({
        queryKey: ["alerts", "expired"],
        queryFn: async (): Promise<AlertProduct[]> => {
            console.log('⚠️ Fetching expired products...');
            const { data } = await apiClient.get<AlertProduct[]>('/inventory/produits');
            
            // Filtrer les produits périmés
            const expired = data.filter(product => {
                const expDate = new Date(product.datePeremption);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return expDate < today;
            });
            
            console.log('✅ Expired products:', expired.length);
            return expired;
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchInterval: 2 * 60 * 1000, // Refrescar cada 2 minutos
    });
}

// Hook pour les produits expirant bientôt (3 jours)
export function useExpiringProducts() {
    return useQuery({
        queryKey: ["alerts", "expiring"],
        queryFn: async (): Promise<AlertProduct[]> => {
            console.log('⚠️ Fetching products expiring soon...');
            const { data } = await apiClient.get<AlertProduct[]>('/inventory/produits/expiring');
            console.log('✅ Products expiring soon:', data.length);
            return data;
        },
        staleTime: 1 * 60 * 1000, // 1 minute
        refetchInterval: 3 * 60 * 1000, // Refrescar cada 3 minutos
    });
}

// Hook pour les produits en alerte (stock faible)
export function useStockAlerts() {
    return useQuery({
        queryKey: ["alerts", "stock"],
        queryFn: async (): Promise<AlertProduct[]> => {
            console.log('⚠️ Fetching stock alerts...');
            const { data } = await apiClient.get<AlertProduct[]>('/inventory/produits/alerts');
            console.log('✅ Stock alerts:', data.length);
            return data;
        },
        staleTime: 2 * 60 * 1000, // 2 minutos
        refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
    });
}

// Hook pour les menus dépassant le budget
export function useMenuBudgetAlerts(seuilBudget: number = 15.0) {
    return useQuery({
        queryKey: ["alerts", "menu-budget", seuilBudget],
        queryFn: async (): Promise<MenuAlert[]> => {
            console.log(`⚠️ Fetching menus over budget (${seuilBudget}€)...`);
            
            try {
                const { data } = await apiClient.get<{content: MenuAlert[]}>('/menus');
                
                // Filtrer les menus qui dépassent le budget
                const menusOverBudget = (data.content || []).filter(menu => {
                    const cout = menu.coutTotalIngredients || 0;
                    const prix = menu.prixVente || 0;
                    return cout > seuilBudget || (prix > 0 && cout > prix * 0.7); // 70% de marge max
                });
                
                console.log('✅ Menus over budget:', menusOverBudget.length);
                return menusOverBudget;
            } catch (error) {
                console.warn('⚠️ Error fetching menu budget alerts:', error);
                return [];
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
        refetchInterval: 10 * 60 * 1000, // Refrescar cada 10 minutos
    });
}

// Fonction utilitaire pour formater les dates
export function formatDate(dateStr: string): string {
    try {
        return new Date(dateStr).toLocaleDateString("fr-FR");
    } catch {
        return dateStr;
    }
}

// Fonction utilitaire pour calculer les jours restants
export function getDaysUntilExpiry(dateStr: string): number {
    const expDate = new Date(dateStr);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Fonction pour formater la monnaie
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
}