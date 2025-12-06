import { useState } from "react";
import SectionCard from "../ui/SectionCard.tsx";
import { Chip } from "../ui/Chip.tsx";
import { useRapports } from "../features/rapports/api"; // ← hook FW5

// Petit helper pour l’affichage des montants
const formatEUR = (n: number | undefined) =>
    new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(n ?? 0);

export default function RapportsPage() {
    // valeurs par défaut : depuis le 1er janvier de l’année courante jusqu’à aujourd’hui
    const now = new Date();
    const currentYear = now.getFullYear();
    const defaultFrom = `${currentYear}-01-01`;
    const defaultTo = now.toISOString().slice(0, 10);

    const [fromInput, setFromInput] = useState(defaultFrom);
    const [toInput, setToInput] = useState(defaultTo);

    // Filtres réellement utilisés pour l’appel API
    const [filters, setFilters] = useState<{ from: string; to: string }>({
        from: defaultFrom,
        to: defaultTo,
    });

    const { data, isLoading, isError } = useRapports({
        from: filters.from,
        to: filters.to,
    });

    const handleGenerate = () => {
        if (!fromInput || !toInput) return;
        // on pourrait ajouter un contrôle from <= to ici
        setFilters({ from: fromInput, to: toInput });
    };

    const handleExport = () => {
        // mock d’export
        // tu pourras plus tard remplacer par un vrai appel API/bibliothèque PDF
        console.log("Export PDF (mock) pour", filters);
        alert("Export PDF (mock) – à implémenter plus tard 😉");
    };

    const coutMoyen = data?.coutMoyen;
    const nbDepassements = data?.nbDepassements;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
            {/* ----------------- Filtre période ----------------- */}
            <SectionCard title="Filtre période">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <label className="flex flex-col gap-1">
                        <span className="text-gray-500">Du</span>
                        <input
                            type="date"
                            value={fromInput}
                            onChange={(e) => setFromInput(e.target.value)}
                            className="px-3 py-2 border rounded-xl focus:outline-none focus:ring w-full"
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="text-gray-500">Au</span>
                        <input
                            type="date"
                            value={toInput}
                            onChange={(e) => setToInput(e.target.value)}
                            className="px-3 py-2 border rounded-xl focus:outline-none focus:ring w-full"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={handleGenerate}
                        className="px-3 py-2 rounded-xl bg-black text-white text-sm mt-1"
                    >
                        Générer
                    </button>

                    <button
                        type="button"
                        onClick={handleExport}
                        className="px-3 py-2 rounded-xl border text-sm mt-1"
                    >
                        Exporter PDF
                    </button>

                    <div className="md:col-span-2 text-xs text-gray-500 mt-1">
                        Période active :{" "}
                        <span className="font-medium">
              {filters.from} → {filters.to}
            </span>
                    </div>
                </div>
            </SectionCard>

            {/* ----------------- Synthèse coûts ----------------- */}
            <SectionCard title="Synthèse coûts">
                {isLoading && <div className="text-sm text-gray-500">Chargement…</div>}
                {isError && (
                    <div className="text-sm text-red-600">
                        Erreur lors du chargement des rapports.
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                            <span>Coût moyen</span>
                            <strong>{coutMoyen != null ? formatEUR(coutMoyen) : "—"}</strong>
                        </div>

                        <div className="flex items-center justify-between">
                            <span>Menus au-dessus du seuil</span>
                            <strong>{nbDepassements ?? "—"}</strong>
                        </div>

                        <div className="flex items-center justify-between">
                            <span>Période analysée</span>
                            <strong>
                                {filters.from} → {filters.to}
                            </strong>
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* ----------------- Graphiques (maquette) ----------------- */}
            <SectionCard title="Graphiques (mock)">
                <div className="h-48 grid place-items-center text-gray-400 text-sm">
                    [Courbes placeholder]
                </div>
            </SectionCard>

            {/* ----------------- Détail des menus (période) ----------------- */}
            <SectionCard title="Détail des menus (période)">
                <div className="overflow-x-auto text-sm">
                    <table className="w-full">
                        <thead className="text-left text-gray-500">
                        <tr>
                            <th className="py-2">Date</th>
                            <th>Nom</th>
                            <th>Coût total</th>
                            <th>Statut budget</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Pour l’instant : données de maquette statiques.
                 Tu pourras plus tard les rendre dynamiques si ton backend renvoie la liste détaillée. */}
                        <tr className="border-t">
                            <td className="py-2">2025-09-01</td>
                            <td>Menu Économique</td>
                            <td>{formatEUR(3.2)}</td>
                            <td>
                                <Chip type="success">OK</Chip>
                            </td>
                        </tr>
                        <tr className="border-t">
                            <td className="py-2">2025-09-02</td>
                            <td>Repas Luxueux</td>
                            <td>{formatEUR(5.5)}</td>
                            <td>
                                <Chip type="warn">Seuil</Chip>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </SectionCard>
        </div>
    );
}
