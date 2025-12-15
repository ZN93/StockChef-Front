import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";


export type RapportItem = {
    id: number;
    nom: string;
    date: string;
    total: number;
    depasse: boolean;
};

export type RapportResponse = {
    coutMoyen: number;
    nbDepassements: number;
    menus: RapportItem[];
};

export function useRapports(params: { from: string; to: string }) {
    return useQuery({
        queryKey: ["rapports", params],
        queryFn: async () => {
            const { from, to } = params;
            const { data } = await apiClient.get<RapportResponse>("/rapports", {
                params: { from, to },
            });
            return data;
        },
        enabled: Boolean(params.from && params.to),
    });
}

