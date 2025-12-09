import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import { api } from "../../api/client";
import type { Page, Produit, NewProduit } from "./types";

export type UseProduitsParams = {
    page: number;
    size: number;
    search?: string;
};

export function useProduits({ page, size, search }: UseProduitsParams) {
    return useQuery({
        queryKey: ["produits", { page, size, search }],
        queryFn: async () => {
            console.log("[RQ] GET /produits ", {
                baseURL: api.defaults.baseURL,
                page,
                size,
                search,
            });

            const resp = await api.get<Page<Produit>>("/produits", {
                params: { page, size, search },
            });
            return resp.data;
        },
        placeholderData: keepPreviousData,
    });
}

export function useCreateProduit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: NewProduit) =>
            (await api.post("/produits", payload)).data as Produit,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["produits"] }),
    });
}

/* Partie Consommer un produit */

export type ConsommerPayload = {
    id: number;
    quantite: number;
};

export function useConsommerProduit() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, quantite }: ConsommerPayload) => {
            await api.patch(`/produits/${id}/stock`, { quantite });
        },
        onSuccess: () => {
            qc.invalidateQueries({
                predicate: (q) =>
                    Array.isArray(q.queryKey) && q.queryKey[0] === "produits",
            });
        },
    });
}

