import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import type {
  Menu,
  CreateMenuRequest,
  EditMenuRequest,
  AddIngredientRequest,
} from "./types";

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

type Page<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
};

export function useMenus(params: { page?: number; size?: number } = {}) {
  return useQuery({
    queryKey: ["menus", params],
    queryFn: async (): Promise<Page<Menu>> => {
      const { page = 0, size = 20 } = params;
      const { data } = await apiClient.get<PagedResponse<Menu>>("/menus", {
        params: { page, size },
      });

      return {
        content: data.content || [],
        page: data.number || 0,
        size: data.size || 20,
        totalElements: data.totalElements || 0,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useMenu(id: number) {
  return useQuery({
    queryKey: ["menus", id],
    queryFn: async (): Promise<Menu> => {
      console.log("🍽️ Fetching menu:", id);
      const { data } = await apiClient.get<Menu>(`/menus/${id}`);
      console.log("✅ Menu fetched:", data);
      return data;
    },
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateMenuRequest): Promise<Menu> => {
      const { data } = await apiClient.post<Menu>("/menus", payload);

      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useEditMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: EditMenuRequest & { id: number }): Promise<Menu> => {
      const { data } = await apiClient.put<Menu>(`/menus/${id}`, payload);

      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["menus"] });
      qc.invalidateQueries({ queryKey: ["menus", data.id] });
    },
  });
}

export function useDeleteMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await apiClient.delete(`/menus/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useConfirmerMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<Menu> => {
      const { data } = await apiClient.patch<Menu>(`/menus/${id}/confirmer`);

      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["menus"] });
      qc.invalidateQueries({ queryKey: ["menus", data.id] });
    },
  });
}

export function useAnnulerMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<Menu> => {
      const { data } = await apiClient.patch<Menu>(`/menus/${id}/annuler`);

      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["menus"] });
      qc.invalidateQueries({ queryKey: ["menus", data.id] });
    },
  });
}

export function useAddIngredientToMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      menuId,
      ingredient,
    }: {
      menuId: number;
      ingredient: AddIngredientRequest;
    }) => {
      const { data } = await apiClient.post(
        `/menus/${menuId}/ingredients`,
        ingredient
      );

      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["menus"] });
      qc.invalidateQueries({ queryKey: ["menus", variables.menuId] });
    },
  });
}

export function useRemoveIngredientFromMenu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      menuId,
      produitId,
    }: {
      menuId: number;
      produitId: number;
    }) => {
      await apiClient.delete(`/menus/${menuId}/ingredients/${produitId}`);
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["menus"] });
      qc.invalidateQueries({ queryKey: ["menus", variables.menuId] });
    },
  });
}

export function useSearchMenus(searchTerm: string) {
  return useQuery({
    queryKey: ["menus", "search", searchTerm],
    queryFn: async (): Promise<Menu[]> => {
      if (!searchTerm.trim()) return [];

      const { data } = await apiClient.get<Menu[]>("/menus/recherche", {
        params: { q: searchTerm },
      });

      return data;
    },
    enabled: searchTerm.trim().length > 0,
    staleTime: 30_000,
  });
}

export function useMenusRealisables(dateService?: string) {
  return useQuery({
    queryKey: ["menus", "realisables", dateService],
    queryFn: async (): Promise<Menu[]> => {
      const params = dateService ? { dateService } : {};
      const { data } = await apiClient.get<Menu[]>("/menus/realisables", {
        params,
      });

      return data;
    },
    enabled: !!dateService,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMenuStatistics(menuId: number) {
  return useQuery({
    queryKey: ["menus", "statistics", menuId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/menus/${menuId}/statistiques`);

      return data;
    },
    enabled: !!menuId,
    staleTime: 2 * 60 * 1000,
  });
}
