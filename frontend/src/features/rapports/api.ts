import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client.ts";


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
            const url = `/api/rapports?from=${from}&to=${to}`;
            const res = await api.get(url);
            return res.data;
        },
        enabled: Boolean(params.from && params.to),
    });
}
