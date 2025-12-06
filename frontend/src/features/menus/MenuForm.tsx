import { useState } from "react";
import { useCreateMenu } from "./api";
import type { NewMenu } from "./types";
import { useProduitOptions } from "../produits/api-options";
import { useMemo } from "react";

const formatEUR = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n);

type ItemDraft = {
    produitId?: number;
    nom: string;
    unite: string;
    prixUnitaire: number;
    quantite: number;
};

export default function MenuForm() {
    const [nom, setNom] = useState("");
    const [items, setItems] = useState<ItemDraft[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const createMenu = useCreateMenu();

    // total live
    const total = useMemo(
        () => items.reduce((acc, it) => acc + (Number(it.prixUnitaire) || 0) * (Number(it.quantite) || 0), 0),
        [items]
    );

    // Charger options produits (simple : 1ère page; on peut filtrer plus tard)
    const { data: produits = [] } = useProduitOptions();

    const addItem = () => {
        setItems(prev => [...prev, { produitId: undefined, nom: "", unite: "", prixUnitaire: 0, quantite: 0 }]);
        // nettoie l'erreur "Au moins un ingrédient"
        setErrors(prev => prev.filter(e => e.toLowerCase() !== "au moins un ingrédient"));
    };

    const updateItem = (idx: number, patch: Partial<ItemDraft>) => {
        setItems(prev => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
        // si on rend une quantité > 0, on nettoie l'erreur correspondante
        if (patch.quantite !== undefined && patch.quantite > 0) {
            setErrors(prev => prev.filter(e => e.toLowerCase() !== "chaque quantité doit être > 0"));
        }
    };

    const onSelectProduit = (idx: number, produitIdStr: string) => {
        const id = Number(produitIdStr);
        const p = produits.find((x) => x.id === id);
        if (!p) return;
        updateItem(idx, {
            produitId: p.id,
            nom: p.nom,
            unite: p.unite,
            prixUnitaire: p.prixUnitaire,
        });
    };

    const validate = () => {
        const err: string[] = [];
        if (!nom.trim()) err.push("Le nom est requis");
        if (items.length === 0) err.push("Au moins un ingrédient");
        if (items.some((i) => !(i.quantite > 0))) err.push("Chaque quantité doit être > 0");
        setErrors(err);
        return err.length === 0;
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const payload: NewMenu = {
            nom,
            items: items.map((i) => ({
                produitId: i.produitId ?? 0, // 0 si libre; quand un produit est choisi, on a un vrai id
                nom: i.nom,
                unite: i.unite,
                quantite: i.quantite,
                prixUnitaire: i.prixUnitaire,
            })),
        };

        try {
            await createMenu.mutateAsync(payload);
            setNom("");
            setItems([]);
            setErrors([]);
        } catch {
            setErrors(["Erreur lors de l’enregistrement"]);
        }
    };

    return (
        <form onSubmit={onSubmit} className="max-w-xl space-y-3">
            <h2 className="text-xl font-semibold">Créer un menu</h2>

            {errors.length > 0 && (
                <ul className="text-red-600 text-sm">
                    {errors.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
            )}

            <label className="block">
                <span>Nom du menu</span>
                <input
                    aria-label="Nom du menu"
                    value={nom}
                    onChange={(e) => {
                        setNom(e.target.value);
                        if (e.target.value.trim()) {
                            setErrors(prev => prev.filter(err => err.toLowerCase() !== "le nom est requis"));
                        }
                    }}
                    className="border rounded px-2 py-1 w-full"
                />
            </label>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ingrédients</span>
                    <button type="button" onClick={addItem} className="border px-3 py-1 rounded">
                        + Ingrédient
                    </button>
                </div>

                {items.length === 0 && <div className="text-gray-500 text-sm">Aucun ingrédient</div>}

                <div className="grid gap-2">
                    {items.map((it, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                            {/* Sélecteur produit */}
                            <label className="col-span-4">
                                <span>Produit #{idx + 1}</span>
                                <select
                                    aria-label={`Produit #${idx + 1}`}
                                    className="border rounded px-2 py-1 w-full"
                                    value={it.produitId ?? ""}
                                    onChange={(e) => onSelectProduit(idx, e.target.value)}
                                >
                                    <option value="">— choisir —</option>
                                    {produits.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.nom}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* Unité (auto-remplie mais éditable) */}
                            <label className="col-span-2">
                                <span>Ingrédient #{idx + 1} unité</span>
                                <input
                                    aria-label={`Ingrédient #${idx + 1} unité`}
                                    value={it.unite}
                                    onChange={(e) => updateItem(idx, {unite: e.target.value})}
                                    className="border rounded px-2 py-1 w-full"
                                />
                            </label>

                            {/* Prix unitaire (auto-rempli mais éditable) */}
                            <label className="col-span-3">
                                <span>Ingrédient #{idx + 1} prix unitaire</span>
                                <input
                                    aria-label={`Ingrédient #${idx + 1} prix unitaire`}
                                    type="number"
                                    value={Number.isFinite(it.prixUnitaire) ? it.prixUnitaire : 0}
                                    onChange={(e) => updateItem(idx, {prixUnitaire: Number(e.target.value)})}
                                    className="border rounded px-2 py-1 w-full"
                                />
                            </label>

                            {/* Quantité */}
                            <label className="col-span-3">
                                <span>Quantité #{idx + 1}</span>
                                <input
                                    aria-label={`Quantité #${idx + 1}`}
                                    type="number"
                                    value={it.quantite}
                                    onChange={(e) => updateItem(idx, {quantite: Number(e.target.value)})}
                                    className="border rounded px-2 py-1 w-full"
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div
                data-testid="menu-total"
                className="flex items-center justify-between border-t pt-2 text-sm"
            >
                <span className="text-gray-600">Total</span>
                <strong>{formatEUR(total)}</strong>
            </div>

            <button type="submit" disabled={createMenu.isPending}
                    className="border px-3 py-1 rounded bg-black text-white disabled:opacity-50">
                {createMenu.isPending ? "Enregistrement…" : "Enregistrer"}
            </button>
        </form>
    );
}
