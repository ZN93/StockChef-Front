import { useState, useMemo } from "react";
import { useCreateMenu} from "../../features/menus/api.ts";
import type { NewMenu} from "../../features/menus/types.ts";
import { useProduitOptions} from "../../features/produits/api-options.ts";

const formatEUR = (n: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
        n || 0
    );

// seuil de budget par repas (en €) – à terme pourra venir du backend / config
const BUDGET_SEUIL = 4.5;

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
        () =>
            items.reduce(
                (acc, it) =>
                    acc +
                    (Number(it.prixUnitaire) || 0) * (Number(it.quantite) || 0),
                0
            ),
        [items]
    );

    const depasseBudget = total > BUDGET_SEUIL;

    // Charger options produits (simple : 1ère page; on peut filtrer plus tard)
    const { data: produits = [] } = useProduitOptions();

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            {
                produitId: undefined,
                nom: "",
                unite: "",
                prixUnitaire: 0,
                quantite: 0,
            },
        ]);
        // nettoie l'erreur "Au moins un ingrédient"
        setErrors((prev) =>
            prev.filter((e) => e.toLowerCase() !== "au moins un ingrédient")
        );
    };

    const updateItem = (idx: number, patch: Partial<ItemDraft>) => {
        setItems((prev) =>
            prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
        );
        // si on rend une quantité > 0, on nettoie l'erreur correspondante
        if (patch.quantite !== undefined && patch.quantite > 0) {
            setErrors((prev) =>
                prev.filter((e) => e.toLowerCase() !== "chaque quantité doit être > 0")
            );
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
        if (items.some((i) => !(i.quantite > 0)))
            err.push("Chaque quantité doit être > 0");
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
<<<<<<< Updated upstream
        <form onSubmit={onSubmit} className="max-w-xl space-y-4">
            {/* Titre local (le SectionCard de MenusPage a déjà son propre titre, mais ça ne gêne pas) */}
=======
        <form onSubmit={onSubmit} className="w-full space-y-4">
>>>>>>> Stashed changes
            <h2 className="text-xl font-semibold">Créer un menu</h2>

            {/* Bandeau budget comme la maquette */}
            <div
                data-testid="menu-budget-banner"
                className={`flex flex-col gap-1 rounded-2xl border px-3 py-2 text-sm
        ${
                    depasseBudget
                        ? "bg-amber-50 border-amber-200 text-amber-800"
                        : "bg-emerald-50 border-emerald-200 text-emerald-800"
                }`}
            >
        <span className="font-medium">
          {depasseBudget ? "Budget dépassé" : "Budget OK"}
        </span>
                <span className="text-xs text-gray-600">
          Total {formatEUR(total)} • Seuil {formatEUR(BUDGET_SEUIL)}
        </span>
            </div>

            {errors.length > 0 && (
                <ul className="text-red-600 text-sm space-y-1">
                    {errors.map((e, i) => (
                        <li key={i}>{e}</li>
                    ))}
                </ul>
            )}

            <label className="block space-y-1">
                <span className="text-sm text-gray-700">Nom du menu</span>
                <input
                    aria-label="Nom du menu"
                    value={nom}
                    onChange={(e) => {
                        setNom(e.target.value);
                        if (e.target.value.trim()) {
                            setErrors((prev) =>
                                prev.filter(
                                    (err) => err.toLowerCase() !== "le nom est requis"
                                )
                            );
                        }
                    }}
                    className="border rounded-xl px-3 py-2 w-full text-sm"
                />
            </label>

            <div className="space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-600">Ingrédients</span>
                    <button
                        type="button"
                        onClick={addItem}
                        className="w-full sm:w-auto px-3 py-1.5 rounded-xl border text-sm bg-white hover:bg-gray-50"
                    >
                        + Ingrédient
                    </button>
                </div>

                {items.length === 0 && (
                    <div className="text-gray-500 text-sm italic">
                        Aucun ingrédient pour l’instant.
                    </div>
                )}

                <div className="grid gap-3">
                    {items.map((it, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end rounded-xl bg-gray-50/60 p-3"
                        >
<<<<<<< Updated upstream
                            {/* Sélecteur produit */}
                            <label className="col-span-4 space-y-1">
=======
                            <label className="sm:col-span-4 col-span-1 space-y-1">
>>>>>>> Stashed changes
                <span className="text-xs text-gray-500">
                  Produit #{idx + 1}
                </span>
                                <select
                                    aria-label={`Produit #${idx + 1}`}
                                    className="border rounded-xl px-2 py-1.5 w-full text-sm"
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

<<<<<<< Updated upstream
                            {/* Unité (auto-remplie mais éditable) */}
                            <label className="col-span-2 space-y-1">
=======
                            <label className="sm:col-span-2 col-span-1 space-y-1">
>>>>>>> Stashed changes
                <span className="text-xs text-gray-500">
                  Unité ingrédient #{idx + 1}
                </span>
                                <input
                                    aria-label={`Ingrédient #${idx + 1} unité`}
                                    value={it.unite}
                                    onChange={(e) => updateItem(idx, {unite: e.target.value})}
                                    className="border rounded-xl px-2 py-1.5 w-full text-sm"
                                />
                            </label>
<<<<<<< Updated upstream

                            {/* Prix unitaire */}
                            <label className="col-span-3 space-y-1">
=======
                            <label className="sm:col-span-3 col-span-1 space-y-1">
>>>>>>> Stashed changes
                <span className="text-xs text-gray-500">
                  Prix unitaire ingrédient #{idx + 1}
                </span>
                                <input
                                    aria-label={`Ingrédient #${idx + 1} prix unitaire`}
                                    type="number"
                                    step="0.01"
                                    value={
                                        Number.isFinite(it.prixUnitaire) ? it.prixUnitaire : 0
                                    }
                                    onChange={(e) =>
                                        updateItem(idx, {prixUnitaire: Number(e.target.value)})
                                    }
                                    className="border rounded-xl px-2 py-1.5 w-full text-sm"
                                />
                            </label>
<<<<<<< Updated upstream

                            {/* Quantité */}
                            <label className="col-span-3 space-y-1">
=======
                            <label className="sm:col-span-3 col-span-1 space-y-1">
>>>>>>> Stashed changes
                <span className="text-xs text-gray-500">
                  Quantité #{idx + 1}
                </span>
                                <input
                                    aria-label={`Quantité #${idx + 1}`}
                                    type="number"
                                    value={it.quantite}
                                    onChange={(e) =>
                                        updateItem(idx, {quantite: Number(e.target.value)})
                                    }
                                    className="border rounded-xl px-2 py-1.5 w-full text-sm"
                                />
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div
                data-testid="menu-total"
                className="flex items-center justify-between border-t pt-3 text-sm"
            >
                <span className="text-gray-600">Total</span>
                <strong
                    className={
                        depasseBudget ? "text-amber-700 font-semibold" : "font-semibold"
                    }
                >
                    {formatEUR(total)}
                </strong>
            </div>

            <button
                type="submit"
                disabled={createMenu.isPending}
                className="mt-1 w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
                {createMenu.isPending ? "Enregistrement…" : "Enregistrer"}
            </button>
        </form>
    );
}
