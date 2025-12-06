import { useQuery } from "@tanstack/react-query";
import axios from "axios";


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
            const res = await axios.get(url);
            return res.data;
        },
        enabled: Boolean(params.from && params.to),
    });
}
