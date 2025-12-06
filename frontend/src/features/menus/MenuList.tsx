import { useMenus } from "./api";

type Props = { seuilBudget?: number };

export default function MenuList({ seuilBudget = 4.5 }: Props) {
    const { data, isLoading, isError } = useMenus({ page: 0, size: 20 });

    if (isLoading) return <div>Chargement…</div>;
    if (isError) return <div>Erreur</div>;

    const rows = data?.content ?? [];
    if (rows.length === 0) {
        return <div className="text-center text-gray-500 py-6">Aucun menu</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-2">Menus</h1>
            <table className="min-w-full text-sm">
                <thead>
                <tr>
                    <th className="text-left py-2">Nom</th>
                    <th className="text-left">Ingrédients</th>
                    <th className="text-left">Coût total</th>
                    <th className="text-left">Budget</th>
                </tr>
                </thead>
                <tbody>
                {rows.map((m) => {
                    const depasse = m.coutTotal > seuilBudget;
                    const itemsLabel = (m.items ?? [])
                        .map(i => `${i.nom} — ${i.quantite} ${i.unite}`)
                        .join(", ");

                    return (
                        <tr key={m.id} className="border-t align-top">
                            <td className="py-2">{m.nom}</td>
                            <td className="py-2">
                                {itemsLabel || <span className="text-gray-500">—</span>}
                            </td>
                            <td className="py-2">{m.coutTotal}</td>
                            <td className="py-2">
                  <span className={depasse ? "text-amber-700" : "text-green-700"}>
                    {depasse ? "Dépassement" : "Budget OK"}
                  </span>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
