import { useState } from "react";
import { useDeleteMenu } from "./api";
import type { Menu } from "./types";

type Props = {
    menu: Menu | null;
    isOpen: boolean;
    onClose: () => void;
};

export default function DeleteMenuModal({ menu, isOpen, onClose }: Props) {
    const deleteMenu = useDeleteMenu();
    const [confirmText, setConfirmText] = useState("");
    const [error, setError] = useState("");

    const expectedText = "SUPPRIMER";
    const canDelete = confirmText === expectedText;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!menu || !canDelete) return;

        try {
            setError("");
            await deleteMenu.mutateAsync(menu.id);
            onClose();
            setConfirmText("");
        } catch (error: unknown) {
            console.error('Error deleting menu:', error);
            const errorMessage = (error as unknown as {response?: {data?: {message?: string}}, message?: string})?.response?.data?.message || (error as unknown as {message?: string})?.message || "Erreur lors de la suppression";
            setError(errorMessage);
        }
    };

    const handleClose = () => {
        setConfirmText("");
        setError("");
        onClose();
    };

    if (!isOpen || !menu) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Supprimer le menu
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mb-4">
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <div className="text-red-600 mr-3">⚠️</div>
                                <div>
                                    <h3 className="text-red-800 font-medium">
                                        Cette action est irréversible
                                    </h3>
                                    <p className="text-red-700 text-sm mt-1">
                                        Le menu et tous ses ingrédients seront définitivement supprimés.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Menu à supprimer:</h4>
                        <div className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium">{menu.nom}</p>
                            {menu.dateService && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Date de service: {new Date(menu.dateService).toLocaleDateString('fr-FR')}
                                </p>
                            )}
                            {menu.ingredients && menu.ingredients.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm font-medium text-gray-700">
                                        {menu.ingredients.length} ingrédient(s):
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {menu.ingredients.map(ingredient => ingredient.produitNom).join(", ")}
                                    </p>
                                </div>
                            )}
                            {menu.coutTotalIngredients && menu.coutTotalIngredients > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Coût total: {menu.coutTotalIngredients.toFixed(2)}€
                                </p>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pour confirmer la suppression, tapez "{expectedText}" ci-dessous:
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder={expectedText}
                            />
                            {confirmText && confirmText !== expectedText && (
                                <p className="text-red-600 text-sm mt-1">
                                    Le texte ne correspond pas
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={!canDelete || deleteMenu.isPending}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {deleteMenu.isPending ? "Suppression..." : "Supprimer définitivement"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}