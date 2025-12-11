import { useState } from "react";
import type { Produit, EditProduitRequest } from "./types";
import { useEditProduit } from "./api-real";

type EditProduitModalProps = {
    produit: Produit | null;
    onClose: () => void;
};

export default function EditProduitModal({
                                             produit,
                                             onClose,
                                         }: EditProduitModalProps) {
    const [nom, setNom] = useState(produit?.nom || "");
    const [prixUnitaire, setPrixUnitaire] = useState(produit?.prixUnitaire?.toString() || "");
    const [seuilAlerte, setSeuilAlerte] = useState(produit?.seuilAlerte?.toString() || "");
    const [datePeremption, setDatePeremption] = useState(produit?.datePeremption || "");
    const [description, setDescription] = useState(produit?.description || "");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const mutation = useEditProduit();

    if (!produit) return null;

    // Obtenir configuration selon le type d'unité
    const getUnitConfig = (unite: string) => {
        switch (unite) {
            case 'PIECE':
                return { suffix: "pièce(s)", allowDecimals: false };
            case 'KILOGRAMME':
                return { suffix: "kg", allowDecimals: true };
            case 'GRAMME':
                return { suffix: "g", allowDecimals: false };
            case 'LITRE':
                return { suffix: "L", allowDecimals: true };
            default:
                return { suffix: "", allowDecimals: true };
        }
    };

    const unitConfig = getUnitConfig(produit.unite);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        // Validations
        if (!nom.trim()) {
            setErrorMsg("Le nom est requis.");
            return;
        }

        const prix = Number(prixUnitaire);
        if (!Number.isFinite(prix) || prix <= 0) {
            setErrorMsg("Le prix unitaire doit être supérieur à 0.");
            return;
        }

        const seuil = Number(seuilAlerte);
        if (!Number.isFinite(seuil) || seuil < 0) {
            setErrorMsg("Le seuil d'alerte doit être supérieur ou égal à 0.");
            return;
        }

        if (!description.trim()) {
            setErrorMsg("La description est requise.");
            return;
        }

        if (!datePeremption) {
            setErrorMsg("La date de péremption est requise.");
            return;
        }

        // Vérifier si date de péremption est dans le futur
        const today = new Date().toISOString().split('T')[0];
        if (datePeremption < today) {
            setErrorMsg("La date de péremption ne peut pas être dans le passé.");
            return;
        }

        try {
            const payload: EditProduitRequest = {};
            
            // Seulement envoyer les champs qui ont changé
            if (nom.trim() !== produit.nom) payload.nom = nom.trim();
            if (prix !== produit.prixUnitaire) payload.prixUnitaire = prix;
            if (seuil !== produit.seuilAlerte) payload.seuilAlerte = seuil;
            if (datePeremption !== produit.datePeremption) payload.datePeremption = datePeremption;
            if (description.trim() !== produit.description) payload.description = description.trim();

            // Si no hay cambios, no hacer request
            if (Object.keys(payload).length === 0) {
                setErrorMsg("Aucune modification détectée.");
                return;
            }

            await mutation.mutateAsync({ 
                id: produit.id, 
                data: payload 
            });
            
            onClose();
        } catch (err: unknown) {
            const error = err as { status?: number; data?: { message?: string } };
            if (error?.status === 400) {
                setErrorMsg(
                    error?.data?.message ?? "Données invalides."
                );
            } else if (error?.status === 404) {
                setErrorMsg("Produit non trouvé.");
            } else {
                setErrorMsg("Une erreur est survenue. Merci de réessayer.");
            }
        }
    };

    const handleCancel = () => {
        // Reset aux valeurs originales
        setNom(produit.nom);
        setPrixUnitaire(produit.prixUnitaire.toString());
        setSeuilAlerte(produit.seuilAlerte.toString());
        setDatePeremption(produit.datePeremption);
        setDescription(produit.description);
        setErrorMsg(null);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-produit-title"
        >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2
                    id="edit-produit-title"
                    className="mb-4 text-lg font-semibold"
                >
                    Modifier le produit
                </h2>

                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Stock actuel :</span>
                        <strong className="text-gray-900">
                            {produit.quantiteStock} {unitConfig.suffix}
                        </strong>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">Unité :</span>
                        <strong className="text-gray-900">
                            {produit.unite} <span className="text-gray-500">(non modifiable)</span>
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
                            Nom du produit
                        </label>
                        <input
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Nom du produit"
                            maxLength={100}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Description du produit"
                            rows={2}
                            maxLength={500}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Prix unitaire (€)
                            </label>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={prixUnitaire}
                                onChange={(e) => setPrixUnitaire(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Seuil d'alerte ({unitConfig.suffix})
                            </label>
                            <input
                                type="number"
                                min="0"
                                step={unitConfig.allowDecimals ? "0.01" : "1"}
                                value={seuilAlerte}
                                onChange={(e) => setSeuilAlerte(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Date de péremption
                        </label>
                        <input
                            type="date"
                            value={datePeremption}
                            onChange={(e) => setDatePeremption(e.target.value)}
                            className="w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            onClick={handleCancel}
                            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            disabled={mutation.isPending}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? "Modification..." : "Modifier"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}