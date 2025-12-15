import { useState, useEffect } from "react";
import { useEditMenu, useMenu } from "./api";
import type { EditMenuRequest } from "./types";

type Props = {
    menuId: number;
    isOpen: boolean;
    onClose: () => void;
};

export default function EditMenuModal({ menuId, isOpen, onClose }: Props) {
    const { data: menu, isLoading } = useMenu(menuId);
    const editMenu = useEditMenu();

    const [formData, setFormData] = useState<EditMenuRequest>({
        nom: "",
        dateService: new Date().toISOString().split('T')[0],
        description: "",
        nombrePortions: 1,
        prixVente: 0,
        chefResponsable: "",
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    useEffect(() => {
        if (menu && !isFormInitialized) {
            setFormData({
                nom: menu.nom || "",
                dateService: menu.dateService || new Date().toISOString().split('T')[0],
                description: menu.description || "",
                nombrePortions: menu.nombrePortions || 0,
                prixVente: menu.prixVente || 0,
                chefResponsable: menu.chefResponsable || "",
            });
            setIsFormInitialized(true);
        }
    }, [menu, isFormInitialized]);

    useEffect(() => {
        if (!isOpen) {
            setIsFormInitialized(false);
            setErrors([]);
        }
    }, [isOpen]);

    const hasChanged = () => {
        if (!menu) return false;
        return (
            formData.nom !== (menu.nom || "") ||
            formData.dateService !== (menu.dateService || "") ||
            formData.description !== (menu.description || "") ||
            formData.nombrePortions !== (menu.nombrePortions || 0) ||
            formData.prixVente !== (menu.prixVente || 0) ||
            formData.chefResponsable !== (menu.chefResponsable || "")
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        if (!formData.nom.trim()) {
            setErrors(["Le nom du menu est requis"]);
            return;
        }

        if (!formData.dateService) {
            setErrors(["La date de service est requise"]);
            return;
        }

        const serviceDate = new Date(formData.dateService);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (serviceDate < today) {
            setErrors(["La date de service ne peut pas être dans le passé"]);
            return;
        }

        if ((formData.prixVente || 0) < 0) {
            setErrors(["Le prix de vente ne peut pas être négatif"]);
            return;
        }

        try {
            await editMenu.mutateAsync({
                id: menuId,
                ...formData,
                nom: formData.nom.trim(),
                description: formData.description?.trim() || undefined,
            });

            setIsFormInitialized(false);
            setErrors([]);
            
            onClose();
        } catch (error: unknown) {
            console.error('Error editing menu:', error);
            const errorMessage = (error as unknown as {response?: {data?: {message?: string}}, message?: string})?.response?.data?.message || (error as unknown as {message?: string})?.message || "Erreur lors de la modification";
            setErrors([errorMessage]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Modifier le menu
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    {isLoading && (
                        <div className="text-center py-8">
                            <div className="animate-pulse">
                                <div className="text-gray-600 mb-2">Chargement des données du menu...</div>
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            </div>
                        </div>
                    )}

                    {menu && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {errors.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <ul className="text-red-600 text-sm space-y-1">
                                        {errors.map((error, i) => <li key={i}>• {error}</li>)}
                                    </ul>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom du menu *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nom}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                                        placeholder="Ex: Salade César Premium"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date de service *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dateService}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dateService: e.target.value }))}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Description détaillée du menu..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Portions
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.nombrePortions}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nombrePortions: Number(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Prix de vente (€)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.prixVente}
                                        onChange={(e) => setFormData(prev => ({ ...prev, prixVente: Number(e.target.value) }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chef responsable
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.chefResponsable}
                                        onChange={(e) => setFormData(prev => ({ ...prev, chefResponsable: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ex: Chef Martin"
                                    />
                                </div>
                            </div>
                            {menu.ingredients && menu.ingredients.length > 0 && (
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <h3 className="font-medium text-gray-700 mb-2">Ingrédients actuels:</h3>
                                    <div className="space-y-1 text-sm">
                                        {menu.ingredients.map((ingredient, idx) => (
                                            <div key={idx} className="flex justify-between">
                                                <span>{ingredient.produitNom}</span>
                                                <span className="text-gray-600">
                                                    {ingredient.quantiteNecessaire} {ingredient.uniteUtilisee} × {ingredient.coutIngredient?.toFixed(2) || '0'}€
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-200 text-sm font-medium">
                                        Total: {menu.coutTotalIngredients?.toFixed(2) || '0'}€
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={editMenu.isPending || !hasChanged()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editMenu.isPending ? "Modification..." : "Modifier"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}