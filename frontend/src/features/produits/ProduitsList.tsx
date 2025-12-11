import { useState } from "react";
import { useProduitsReal } from "./api-real";
import { computeStatus } from "./status";
import { useDebounce } from "./useDebounce";
import ConsommerProduitModal from "./ConsommerProduitModal";
import EditProduitModal from "./EditProduitModal";
import DeleteProduitModal from "./DeleteProduitModal";
import type { Produit } from "./types";

export default function ProduitsList() {
    const [query, setQuery] = useState("");
    const debounced = useDebounce(query, 350);
    
    // Usar backend real - obtiene todos los productos
    const { data: allProduits, isLoading, isError, isFetching } = useProduitsReal();
    
    // Filtrar en frontend por búsqueda
    const filteredProduits = allProduits?.filter(p => 
        !debounced || p.nom.toLowerCase().includes(debounced.toLowerCase())
    ) || [];
    
    // Simular paginación frontend
    const [page, setPage] = useState(0);
    const size = 20;
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const rows = filteredProduits.slice(startIndex, endIndex);
    const total = filteredProduits.length;
    const lastPage = Math.max(Math.ceil(total / size) - 1, 0);

    const [produitAConsommer, setProduitAConsommer] = useState<Produit | null>(
        null
    );
    const [produitAEditer, setProduitAEditer] = useState<Produit | null>(
        null
    );
    const [produitASupprimer, setProduitASupprimer] = useState<Produit | null>(
        null
    );

    if (isLoading) return <div>Chargement…</div>;
    if (isError) return <div>Erreur</div>;

    const canPrev = page > 0;
    const canNext = page < lastPage;

    const labelFor: Record<ReturnType<typeof computeStatus>, string> = {
        OK: "OK",
        PROCHE: "Proche",
        PERIME: "Périmé",
    };

    return (
        <div>
            <h1 className="mb-2 text-2xl font-semibold">Produits</h1>

            <div className="mb-2 flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={query}
                    onChange={(e) => {
                        setPage(0);
                        setQuery(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            setQuery("");
                            setPage(0);
                        }
                    }}
                    className="rounded border px-2 py-1"
                    aria-label="Recherche produits"
                />
                <span className="text-sm text-gray-500">
          Page {page + 1} / {lastPage + 1} {isFetching && "(maj...)"}
        </span>
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 0))}
                    disabled={!canPrev}
                    className="rounded border px-3 py-1 disabled:opacity-50"
                    aria-label="Précédent"
                >
                    Précédent
                </button>
                <button
                    onClick={() => setPage((p) => Math.min(p + 1, lastPage))}
                    disabled={!canNext}
                    className="rounded border px-3 py-1 disabled:opacity-50"
                    aria-label="Suivant"
                >
                    Suivant
                </button>

                {query && (
                    <button
                        className="rounded border px-3 py-1"
                        onClick={() => {
                            setQuery("");
                            setPage(0);
                        }}
                    >
                        Effacer
                    </button>
                )}
            </div>

            <table className="min-w-full text-sm">
                <thead>
                <tr>
                    <th className="py-2 text-left">Nom</th>
                    <th className="text-left">Qté</th>
                    <th className="text-left">Unité</th>
                    <th className="text-left">Prix u.</th>
                    <th className="text-left">Statut</th>
                    <th className="text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {rows.length > 0 ? (
                    rows.map((p) => {
                        const s = computeStatus(p.datePeremption);
                        const cls =
                            s === "OK"
                                ? "text-green-600"
                                : s === "PROCHE"
                                    ? "text-amber-600"
                                    : "text-red-600";

                        return (
                            <tr key={p.id} className="border-b">
                                <td className="py-2">{p.nom}</td>
                                <td>{p.quantiteStock}</td>
                                <td>{p.unite}</td>
                                <td>{p.prixUnitaire}</td>
                                <td>
                                    <span className={cls}>{labelFor[s]}</span>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {/* Botón Editar */}
                                        <button
                                            type="button"
                                            onClick={() => setProduitAEditer(p)}
                                            className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                                            title="Modifier le produit"
                                        >
                                            Edit
                                        </button>
                                        
                                        {/* Botón Eliminar */}
                                        <button
                                            type="button"
                                            onClick={() => setProduitASupprimer(p)}
                                            className="rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                                            title="Supprimer"
                                        >
                                            Delete
                                        </button>
                                        
                                        {/* Botón Consommer */}
                                        <button
                                            type="button"
                                            onClick={() => setProduitAConsommer(p)}
                                            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                                        >
                                            Consommer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr className="border-t">
                        <td colSpan={6} className="py-6 text-center text-gray-500">
                            Aucun produit
                            {query ? ` pour “${query}”` : ""}.{" "}
                            {query && (
                                <button
                                    className="underline"
                                    onClick={() => {
                                        setQuery("");
                                        setPage(0);
                                    }}
                                >
                                    Effacer la recherche
                                </button>
                            )}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Modal de consommation */}
            {produitAConsommer && (
                <ConsommerProduitModal
                    produit={produitAConsommer}
                    onClose={() => setProduitAConsommer(null)}
                />
            )}

            {/* Modal d'édition */}
            {produitAEditer && (
                <EditProduitModal
                    produit={produitAEditer}
                    onClose={() => setProduitAEditer(null)}
                />
            )}

            {/* Modal de suppression */}
            {produitASupprimer && (
                <DeleteProduitModal
                    produit={produitASupprimer}
                    onClose={() => setProduitASupprimer(null)}
                />
            )}
        </div>
    );
}
