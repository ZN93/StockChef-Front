import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "../../api/client.ts";
import type { Menu, NewMenu } from "./types";


type Page<T> = { content: T[]; page: number; size: number; totalElements: number };

export function useMenus(params: { page?: number; size?: number } = {}) {
    return useQuery({
        queryKey: ["menus", params],
        queryFn: async (): Promise<Page<Menu>> => {
            const { data } = await api.get("/menus", { params });
            return data;
        },
        placeholderData: keepPreviousData,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });
}

export function useCreateMenu() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: NewMenu) => {
            const { data } = await api.post<Menu>("/menus", payload);
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["menus"] });
        },
    });
}
