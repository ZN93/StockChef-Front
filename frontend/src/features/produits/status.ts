export type Statut = "OK" | "PROCHE" | "PERIME";

export function computeStatus(peremption?: string, today = new Date()): Statut {
    if (!peremption) return "OK";
    const d = new Date(peremption);
    if (d < today) return "PERIME";
    const diff = (d.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diff <= 3 ? "PROCHE" : "OK";
}
