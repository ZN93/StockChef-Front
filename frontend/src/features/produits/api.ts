import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "../../api/client.ts";
import type { Page, Produit, NewProduit } from "./types";
import { client } from "./client";


export function useProduits(page: number, search?: string) {
    return useQuery({
        queryKey: ["produits", { page, search }],
        queryFn: async () => {
            console.log("[RQ] GET /produits ", { baseURL: api.defaults.baseURL, page, size: 20, search });

            const resp = await api.get<Page<Produit>>("/produits", {
                params: { page, size: 20, search },
            });
            return resp.data;
        },
        placeholderData: keepPreviousData,
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
