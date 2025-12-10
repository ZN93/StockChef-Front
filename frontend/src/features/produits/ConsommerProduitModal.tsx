import { useState } from "react";
import type { Produit } from "./types";
import { useConsommerProduit } from "./api-real";

type ConsommerProduitModalProps = {
    produit: Produit | null;
    onClose: () => void;
};

export default function ConsommerProduitModal({
                                                  produit,
                                                  onClose,
                                              }: ConsommerProduitModalProps) {
    const [quantite, setQuantite] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const mutation = useConsommerProduit();

    if (!produit) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        const q = Number(quantite);

        // ✅ Validation front : 0 < qte ≤ stock
        if (!Number.isFinite(q) || q <= 0) {
            setErrorMsg("La quantité doit être supérieure à 0.");
            return;
        }
        if (q > produit.quantiteStock) {
            setErrorMsg("Quantité supérieure au stock disponible.");
            return;
        }

        try {
            await mutation.mutateAsync({ 
                id: produit.id, 
                data: { quantite: q } 
            });
            // Modal se ferme après succès
            onClose();
        } catch (err: unknown) {
            // Gestion erreur 400 (stock insuffisant)
            const error = err as { status?: number; data?: { message?: string } };
            if (error?.status === 400) {
                setErrorMsg(
                    error?.data?.message ?? "Stock insuffisant pour cette quantité."
                );
            } else {
                setErrorMsg("Une erreur est survenue. Merci de réessayer.");
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consommer-produit-title"
        >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2
                    id="consommer-produit-title"
                    className="mb-4 text-lg font-semibold"
                >
                    Consommer un produit
                </h2>

                <p className="mb-2 text-sm text-gray-700">
                    {produit.nom} — Stock actuel :{" "}
                    <strong>
                        {produit.quantiteStock} {produit.unite}
                    </strong>
                </p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Quantité à consommer
                        </label>
                        <input
                            type="number"
                            min={0}
                            step="1"
                            value={quantite}
                            onChange={(e) => setQuantite(e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm"
                        />
                    </div>

                    {errorMsg && (
                        <p className="text-sm text-red-600" role="alert">
                            {errorMsg}
                        </p>
                    )}

                    <div className="mt-4 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded border px-3 py-1 text-sm"
                            disabled={mutation.isPending}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Validation..." : "Confirmer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
