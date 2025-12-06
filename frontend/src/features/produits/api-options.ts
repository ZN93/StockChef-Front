import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Produit } from "./types";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "/api" });
type Page<T> = { content: T[]; page: number; size: number; totalElements: number };

export function useProduitOptions(search?: string) {
    return useQuery({
        queryKey: ["produit-options", search ?? ""],
        queryFn: async (): Promise<Produit[]> => {
            const { data } = await api.get<Page<Produit>>("/produits", {
                params: { page: 0, size: 50, search: search || undefined },
            });
            return data.content;
        },
        staleTime: 60_000,
        refetchOnWindowFocus: false,
    });
}
