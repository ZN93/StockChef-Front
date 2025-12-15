import { useState } from "react";
import { useConfirmerMenu, useAnnulerMenu } from "./api";
import type { Menu } from "./types";

type Props = {
    menu: Menu | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function MenuActionsModal({ menu, isOpen, onClose }: Props) {
    const confirmerMenu = useConfirmerMenu();
    const annulerMenu = useAnnulerMenu();
    const [error, setError] = useState("");

    const isBrouillon = menu?.statut === 'BROUILLON' || !menu?.statut;
    const isConfirme = menu?.statut === 'CONFIRME';
    const isRealise = menu?.statut === 'REALISE';
    const isAnnule = menu?.statut === 'ANNULE';

    const handleConfirmer = async () => {
        if (!menu) return;
        try {
            setError("");
            await confirmerMenu.mutateAsync(menu.id);
            onClose();
        } catch (error: unknown) {
            console.error('Error confirming menu:', error);
            const errorMessage = (error as unknown as {response?: {data?: {message?: string}}, message?: string})?.response?.data?.message || (error as unknown as {message?: string})?.message || "Erreur lors de la confirmation";
            setError(errorMessage);
        }
    };

    const handleAnnuler = async () => {
        if (!menu) return;
        try {
            setError("");
            await annulerMenu.mutateAsync(menu.id);
            onClose();
        } catch (error: unknown) {
            console.error('Error canceling menu:', error);
            const errorMessage = (error as unknown as {response?: {data?: {message?: string}}, message?: string})?.response?.data?.message || (error as unknown as {message?: string})?.message || "Erreur lors de l'annulation";
            setError(errorMessage);
        }
    };

    const handleClose = () => {
        setError("");
        onClose();
    };

    if (!isOpen || !menu) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Actions du menu
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="font-medium text-gray-900 mb-2">{menu.nom}</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-600">Statut:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    isBrouillon ? 'bg-gray-100 text-gray-800' :
                                    isConfirme ? 'bg-blue-100 text-blue-800' :
                                    isRealise ? 'bg-green-100 text-green-800' :
                                    isAnnule ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {menu.statut}
                                </span>
                            </div>
                            {menu.ingredients && menu.ingredients.length > 0 && (
                                <div className="text-sm text-gray-600">
                                    {menu.ingredients.length} ingrédient(s) - Coût: {menu.coutTotalIngredients?.toFixed(2) || '0'}€
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {isBrouillon && (
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Actions disponibles:</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={handleConfirmer}
                                        disabled={confirmerMenu.isPending}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span>✅</span>
                                        <span>{confirmerMenu.isPending ? "Confirmation..." : "Confirmer le menu"}</span>
                                    </button>
                                    <p className="text-sm text-gray-600">
                                        Confirmer le menu le rendra prêt pour la préparation et verrouillera les modifications.
                                    </p>
                                </div>
                            </div>
                        )}

                        {isConfirme && (
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Actions disponibles:</h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={handleAnnuler}
                                        disabled={annulerMenu.isPending}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span>❌</span>
                                        <span>{annulerMenu.isPending ? "Annulation..." : "Annuler le menu"}</span>
                                    </button>
                                    <p className="text-sm text-gray-600">
                                        Annuler le menu le remettra en brouillon pour permettre les modifications.
                                    </p>
                                </div>
                            </div>
                        )}

                        {(isRealise || isAnnule) && (
                            <div className="text-center py-4">
                                <p className="text-gray-600">
                                    {isRealise ? "Ce menu a été réalisé. Aucune action supplémentaire disponible." : "Ce menu a été annulé."}
                                </p>
                            </div>
                        )}
                        {menu.ingredients && menu.ingredients.length > 0 && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <h4 className="text-sm font-medium text-yellow-800 mb-1">💡 Impact sur le stock:</h4>
                                <div className="text-xs text-yellow-700 space-y-1">
                                    {menu.ingredients.map((ingredient, idx) => (
                                        <div key={idx} className="flex justify-between">
                                            <span>{ingredient.produitNom}:</span>
                                            <span>{ingredient.quantiteNecessaire} {ingredient.uniteUtilisee}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}