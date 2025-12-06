import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import type { Page, Produit, NewProduit } from "./types";
import { client } from "./client";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api", // ← toujours /api en dev
});

export function useProduits(params: { search?: string; page?: number; size?: number } = {}) {
    return useQuery({
        queryKey: ["produits", params],
        queryFn: async (): Promise<Page<Produit>> => {
            console.log("[RQ] GET /produits", { baseURL: api.defaults.baseURL, ...params }); // 👀 log
            const { data } = await api.get("/produits", { params }); // ← appelle /api/produits
            return data;
        },
        placeholderData: keepPreviousData,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });
}

export function useCreateProduit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: NewProduit) => (await api.post("/produits", payload)).data as Produit,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["produits"] }),
    });
}
export type ConsommerPayload = {
    id: number;
    quantite: number;
};

export function consommerProduit({ id, quantite }: ConsommerPayload) {
    return client(`/api/produits/${id}/stock`, {
        method: "PATCH",
        body: JSON.stringify({ quantite }),
    });
}

export function useConsommerProduit() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: consommerProduit,
        onSuccess: () => {
            qc.invalidateQueries({
                predicate: (q) =>
                    Array.isArray(q.queryKey) && q.queryKey[0] === "produits",
            });
        },
    });
}
