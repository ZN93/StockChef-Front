import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import type { Menu, CreateMenuRequest, EditMenuRequest, AddIngredientRequest } from "./types";

// Estructura de respuesta paginada del backend
type PagedResponse<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
};

type Page<T> = { content: T[]; page: number; size: number; totalElements: number };

// Hook para obtener lista de menús
export function useMenus(params: { page?: number; size?: number } = {}) {
    return useQuery({
        queryKey: ["menus", params],
        queryFn: async (): Promise<Page<Menu>> => {
            console.log('🍽️ Fetching menus with params:', params);
            const { page = 0, size = 20 } = params;
            const { data } = await apiClient.get<PagedResponse<Menu>>("/menus", { 
                params: { page, size }
            });
            console.log('✅ Menus response:', data);
            
            return {
                content: data.content || [],
                page: data.number || 0,
                size: data.size || 20,
                totalElements: data.totalElements || 0
            };
        },
        placeholderData: keepPreviousData,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });
}

// Hook para obtener un menú específico
export function useMenu(id: number) {
    return useQuery({
        queryKey: ["menus", id],
        queryFn: async (): Promise<Menu> => {
            console.log('🍽️ Fetching menu:', id);
            const { data } = await apiClient.get<Menu>(`/menus/${id}`);
            console.log('✅ Menu fetched:', data);
            return data;
        },
        enabled: !!id,
        staleTime: 30_000,
    });
}

// Hook para crear un nuevo menú
export function useCreateMenu() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateMenuRequest): Promise<Menu> => {
            console.log('🍽️ Creating menu:', payload);
            const { data } = await apiClient.post<Menu>("/menus", payload);
            console.log('✅ Menu created:', data);
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["menus"] });
        },
    });
}

// Hook para editar un menú
export function useEditMenu() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...payload }: EditMenuRequest & { id: number }): Promise<Menu> => {
            console.log('🍽️ Editing menu:', id, payload);
            const { data } = await apiClient.put<Menu>(`/menus/${id}`, payload);
            console.log('✅ Menu edited:', data);
            return data;
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ["menus"] });
            qc.invalidateQueries({ queryKey: ["menus", data.id] });
        },
    });
}

// Hook para eliminar un menú
export function useDeleteMenu() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number): Promise<void> => {
            console.log('🍽️ Deleting menu:', id);
            await apiClient.delete(`/menus/${id}`);
            console.log('✅ Menu deleted:', id);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["menus"] });
        },
    });
}

// Hook para confirmar un menú
export function useConfirmerMenu() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number): Promise<Menu> => {
            console.log('🍽️ Confirming menu:', id);
            const { data } = await apiClient.patch<Menu>(`/menus/${id}/confirmer`);
            console.log('✅ Menu confirmed:', data);
            return data;
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ["menus"] });
            qc.invalidateQueries({ queryKey: ["menus", data.id] });
        },
    });
}

// Hook para anular un menú
export function useAnnulerMenu() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number): Promise<Menu> => {
            console.log('🍽️ Canceling menu:', id);
            const { data } = await apiClient.patch<Menu>(`/menus/${id}/annuler`);
            console.log('✅ Menu canceled:', data);
            return data;
        },
        onSuccess: (data) => {
            qc.invalidateQueries({ queryKey: ["menus"] });
            qc.invalidateQueries({ queryKey: ["menus", data.id] });
        },
    });
}

// Hook para agregar ingrediente a un menú
export function useAddIngredientToMenu() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ menuId, ingredient }: { menuId: number; ingredient: AddIngredientRequest }) => {
            console.log(`🥗 Adding ingredient to menu ${menuId}:`, ingredient);
            const { data } = await apiClient.post(`/menus/${menuId}/ingredients`, ingredient);
            console.log('✅ Ingredient added successfully:', data);
            return data;
        },
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ["menus"] });
            qc.invalidateQueries({ queryKey: ["menus", variables.menuId] });
        },
    });
}

// Hook para eliminar ingrediente de un menú
export function useRemoveIngredientFromMenu() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ menuId, produitId }: { menuId: number; produitId: number }) => {
            console.log(`🗑️ Removing ingredient ${produitId} from menu ${menuId}`);
            await apiClient.delete(`/menus/${menuId}/ingredients/${produitId}`);
            console.log('✅ Ingredient removed successfully');
        },
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ["menus"] });
            qc.invalidateQueries({ queryKey: ["menus", variables.menuId] });
        },
    });
}

// Hook para buscar menús
export function useSearchMenus(searchTerm: string) {
    return useQuery({
        queryKey: ["menus", "search", searchTerm],
        queryFn: async (): Promise<Menu[]> => {
            if (!searchTerm.trim()) return [];
            console.log('🔍 Searching menus:', searchTerm);
            const { data } = await apiClient.get<Menu[]>('/menus/recherche', {
                params: { q: searchTerm }
            });
            console.log('✅ Search results:', data.length);
            return data;
        },
        enabled: searchTerm.trim().length > 0,
        staleTime: 30_000,
    });
}

// Hook para obtener menús realizables en una fecha
export function useMenusRealisables(dateService?: string) {
    return useQuery({
        queryKey: ["menus", "realisables", dateService],
        queryFn: async (): Promise<Menu[]> => {
            console.log('🎯 Fetching realizable menus for date:', dateService);
            const params = dateService ? { dateService } : {};
            const { data } = await apiClient.get<Menu[]>('/menus/realisables', { params });
            console.log('✅ Realizable menus:', data.length);
            return data;
        },
        enabled: !!dateService,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}

// Hook para obtener estadísticas de un menú
export function useMenuStatistics(menuId: number) {
    return useQuery({
        queryKey: ["menus", "statistics", menuId],
        queryFn: async () => {
            console.log('📊 Fetching menu statistics:', menuId);
            const { data } = await apiClient.get(`/menus/${menuId}/statistiques`);
            console.log('✅ Menu statistics:', data);
            return data;
        },
        enabled: !!menuId,
        staleTime: 2 * 60 * 1000, // 2 minutos
    });
}
