import { SectionCard, KPI, formatCurrency } from "../ui/kit";

const mockProduits = [
    {
        id: 1,
        nom: "Farine",
        quantite: 18,
        unite: "kg",
        prix: 1.9,
        entree: "2025-08-15",
        peremption: "2025-10-15",
    },
    {
        id: 2,
        nom: "Lait UHT",
        quantite: 10,
        unite: "L",
        prix: 0.85,
        entree: "2025-09-01",
        peremption: "2025-09-10",
    },
    {
        id: 3,
        nom: "Oeufs",
        quantite: 120,
        unite: "u",
        prix: 0.15,
        entree: "2025-09-05",
        peremption: "2025-09-20",
    },
];

const SEUIL_BUDGET = 4.5;
const JOURS_PEREMPTION = 3;

export default function DashboardPage() {
    const coutMoyen = 3.85;
    const nbMenusDepassement = 1;
    const nbPerimes = 1;
    const nbProches = 2;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPI
                title="Coût moyen (mois)"
                value={formatCurrency(coutMoyen)}
                subtitle={`Seuil ${formatCurrency(SEUIL_BUDGET)}`}
            />
            <KPI
                title="Produits périmés"
                value={String(nbPerimes)}
                tone="danger"
                subtitle="À retirer du stock"
            />
            <KPI
                title={`Péremption < ${JOURS_PEREMPTION} j`}
                value={String(nbProches)}
                tone="warn"
                subtitle="À consommer d'abord"
            />
            <KPI
                title="Menus > seuil"
                value={String(nbMenusDepassement)}
                tone="warn"
                subtitle="À arbitrer"
            />

            <div className="md:col-span-2">
                <SectionCard
                    title="Derniers produits entrés"
                    actions={
                        <button className="px-3 py-1.5 rounded-full border text-xs">
                            Voir tout
                        </button>
                    }
                >
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500">
                        <tr>
                            <th className="py-2">Produit</th>
                            <th>Quantité</th>
                            <th>Prix u.</th>
                            <th>Date d'entrée</th>
                            <th>Péremption</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mockProduits.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="py-2 font-medium">{p.nom}</td>
                                <td>
                                    {p.quantite} {p.unite}
                                </td>
                                <td>{formatCurrency(p.prix)}</td>
                                <td>{p.entree}</td>
                                <td>{p.peremption}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </SectionCard>
            </div>

            <div className="md:col-span-2">
                <SectionCard title="Évolution du coût moyen (mock)">
                    <div className="h-48 grid place-items-center text-gray-400">
                        [Graphique placeholder]
                    </div>
                </SectionCard>
            </div>
        </div>
    );
}
