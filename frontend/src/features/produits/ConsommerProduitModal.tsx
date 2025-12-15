import { useState } from "react";
import type { Produit } from "./types";
import { useConsommerProduit } from "./api-real";

type ConsommerProduitModalProps = {
    produit: Produit | null;
    onClose: () => void;
};

export default function ConsommerProduitModal({produit,onClose,}: ConsommerProduitModalProps) {
    const [quantite, setQuantite] = useState("");
    const [motif, setMotif] = useState("Consommation cuisine");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const mutation = useConsommerProduit();

    if (!produit) return null;

    const getUnitConfig = (unite: string) => {
        switch (unite) {
            case 'PIECE':
                return { step: "1", precision: 0, suffix: "pièce(s)" };
            case 'KILOGRAMME':
                return { step: "0.001", precision: 3, suffix: "kg" };
            case 'GRAMME':
                return { step: "1", precision: 0, suffix: "g" };
            case 'LITRE':
                return { step: "0.01", precision: 2, suffix: "L" };
            default:
                return { step: "0.01", precision: 2, suffix: "" };
        }
    };

    const unitConfig = getUnitConfig(produit.unite);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        const q = Number(quantite);
        if (!Number.isFinite(q) || q <= 0) {
            setErrorMsg("La quantité doit être supérieure à 0.");
            return;
        }
        
        if (q > produit.quantiteStock) {
            setErrorMsg(`Quantité supérieure au stock disponible (${produit.quantiteStock} ${unitConfig.suffix}).`);
            return;
        }

        if (!motif.trim()) {
            setErrorMsg("Le motif est requis.");
            return;
        }

        const decimals = (quantite.split('.')[1] || '').length;
        if (decimals > unitConfig.precision) {
            setErrorMsg(`Maximum ${unitConfig.precision} décimales pour cette unité.`);
            return;
        }

        try {
            await mutation.mutateAsync({ 
                id: produit.id, 
                data: { quantite: q, motif: motif.trim() } 
            });
            setQuantite("");
            setMotif("Consommation cuisine");
            onClose();
        } catch (err: unknown) {
            const error = err as { status?: number; data?: { message?: string } };
            if (error?.status === 400) {
                setErrorMsg(
                    error?.data?.message ?? "Stock insuffisant pour cette quantité."
                );
            } else if (error?.status === 404) {
                setErrorMsg("Produit non trouvé.");
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
                    Sortie de stock - {produit.nom}
                </h2>

                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Stock actuel :</span>
                        <strong className="text-gray-900">
                            {produit.quantiteStock} {unitConfig.suffix}
                        </strong>
                    </div>
                    {produit.quantiteStock <= produit.seuilAlerte && (
                        <div className="mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                            ⚠️ Stock faible (seuil: {produit.seuilAlerte} {unitConfig.suffix})
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Quantité à sortir ({unitConfig.suffix})
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={produit.quantiteStock}
                            step={unitConfig.step}
                            value={quantite}
                            onChange={(e) => setQuantite(e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder={`Max: ${produit.quantiteStock}`}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Motif de la sortie
                        </label>
                        <select
                            value={motif}
                            onChange={(e) => setMotif(e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                            <option value="Consommation cuisine">Consommation cuisine</option>
                            <option value="Préparation menu">Préparation menu</option>
                            <option value="Perte/Avarie">Perte/Avarie</option>
                            <option value="Date expirée">Date expirée</option>
                            <option value="Commande client">Commande client</option>
                            <option value="Inventaire">Ajustement inventaire</option>
                            <option value="Autre">Autre</option>
                        </select>
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
                            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            disabled={mutation.isPending}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={mutation.isPending || !quantite.trim()}
                        >
                            {mutation.isPending ? "Validation..." : "Confirmer sortie"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
