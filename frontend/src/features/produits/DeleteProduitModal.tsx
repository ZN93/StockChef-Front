import { useState } from "react";
import type { Produit } from "./types";
import { useDeleteProduit } from "./api-real";

type DeleteProduitModalProps = {
    produit: Produit | null;
    onClose: () => void;
};

export default function DeleteProduitModal({produit,onClose,}: DeleteProduitModalProps) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const mutation = useDeleteProduit();

    if (!produit) return null;

    const getUnitConfig = (unite: string) => {
        switch (unite) {
            case 'PIECE':
                return { suffix: "pièce(s)" };
            case 'KILOGRAMME':
                return { suffix: "kg" };
            case 'GRAMME':
                return { suffix: "g" };
            case 'LITRE':
                return { suffix: "L" };
            default:
                return { suffix: "" };
        }
    };

    const unitConfig = getUnitConfig(produit.unite);

    const handleConfirmDelete = async () => {
        setErrorMsg(null);

        try {
            await mutation.mutateAsync(produit.id);
            onClose();
        } catch (err: unknown) {
            const error = err as { status?: number; data?: { message?: string } };
            if (error?.status === 404) {
                setErrorMsg("Produit non trouvé.");
            } else if (error?.status === 403) {
                setErrorMsg("Permission insuffisante pour supprimer ce produit.");
            } else if (error?.status === 409) {
                setErrorMsg("Impossible de supprimer : produit utilisé dans des menus actifs.");
            } else {
                setErrorMsg("Une erreur est survenue. Merci de réessayer.");
            }
        }
    };

    const handleCancel = () => {
        setErrorMsg(null);
        onClose();
    };
    const hasStock = produit.quantiteStock > 0;
    const isLowStock = produit.quantiteStock <= produit.seuilAlerte;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-produit-title"
        >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2
                    id="delete-produit-title"
                    className="mb-4 text-lg font-semibold text-red-600"
                >
                    🗑️ Supprimer le produit
                </h2>

                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
                    <div className="text-sm">
                        <p className="font-medium text-red-800 mb-2">
                            Êtes-vous sûr de vouloir supprimer ce produit ?
                        </p>
                        <div className="text-red-700">
                            <strong>{produit.nom}</strong>
                        </div>
                        <div className="text-red-600 text-xs mt-1">
                            {produit.description}
                        </div>
                    </div>
                </div>

                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                    <div className="text-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Stock actuel :</span>
                            <strong className={hasStock ? "text-gray-900" : "text-red-600"}>
                                {produit.quantiteStock} {unitConfig.suffix}
                            </strong>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Prix unitaire :</span>
                            <strong className="text-gray-900">
                                {produit.prixUnitaire}€
                            </strong>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Seuil d'alerte :</span>
                            <strong className="text-gray-900">
                                {produit.seuilAlerte} {unitConfig.suffix}
                            </strong>
                        </div>
                    </div>
                    
                    {hasStock && (
                        <div className="mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                            ⚠️ Attention : Ce produit a encore du stock disponible
                        </div>
                    )}
                    
                    {isLowStock && hasStock && (
                        <div className="mt-1 text-xs text-orange-700 bg-orange-50 px-2 py-1 rounded border border-orange-200">
                            📉 Stock actuellement sous le seuil d'alerte
                        </div>
                    )}
                </div>

                <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
                    <div className="text-xs text-yellow-800">
                        <p className="font-medium mb-1">💡 Information importante :</p>
                        <ul className="space-y-1 text-yellow-700">
                            <li>• La suppression est définitive pour l'inventaire actif</li>
                            <li>• Les données restent accessibles pour l'audit</li>
                            <li>• Cette action ne peut pas être annulée</li>
                        </ul>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mb-4">
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2" role="alert">
                            {errorMsg}
                        </p>
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        disabled={mutation.isPending}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmDelete}
                        className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? "Suppression..." : "Confirmer la suppression"}
                    </button>
                </div>
            </div>
        </div>
    );
}