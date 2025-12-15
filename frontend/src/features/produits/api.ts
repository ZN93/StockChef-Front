import {
    useQuery,
    useMutation,
    useQueryClient,
    keepPreviousData,
} from "@tanstack/react-query";
import { apiClient } from "../../api/client";
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
            const resp = await apiClient.get<Page<Produit>>("/produits", {
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
            (await apiClient.post("/produits", payload)).data as Produit,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["produits"] }),
    });
}

export type ConsommerPayload = {
    id: number;
    quantite: number;
};

export function useConsommerProduit() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, quantite }: ConsommerPayload) => {
            await apiClient.patch(`/produits/${id}/stock`, { quantite });
        },
        onSuccess: () => {
            qc.invalidateQueries({
                predicate: (q) =>
                    Array.isArray(q.queryKey) && q.queryKey[0] === "produits",
            });
        },
    });
}

