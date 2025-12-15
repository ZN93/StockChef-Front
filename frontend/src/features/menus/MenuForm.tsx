import { useState } from "react";
import { useCreateMenu, useAddIngredientToMenu } from "./api";
import type { CreateMenuRequest, AddIngredientRequest } from "./types";
import { useProduitsReal } from "../produits/api-real";
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
    const [description, setDescription] = useState("");
    const [dateService, setDateService] = useState("");
    const [prixVente, setPrixVente] = useState<string>("");
    const [nombrePortions, setNombrePortions] = useState<string>("");
    const [items, setItems] = useState<ItemDraft[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    
    const createMenu = useCreateMenu();
    const addIngredientToMenu = useAddIngredientToMenu();

    const { data: produits, isLoading: isProduitsLoading } = useProduitsReal();
    const produitsArray = produits || [];

    const total = useMemo(
        () => items.reduce((acc, it) => acc + (Number(it.prixUnitaire) || 0) * (Number(it.quantite) || 0), 0),
        [items]
    );

    const addItem = () => {
        setItems(prev => [...prev, { produitId: undefined, nom: "", unite: "", prixUnitaire: 0, quantite: 0 }]);
        setErrors(prev => prev.filter(e => !e.includes("ingrédient")));
    };

    const updateItem = (idx: number, patch: Partial<ItemDraft>) => {
        setItems(prev => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
    };

    const removeItem = (idx: number) => {
        setItems(prev => prev.filter((_, i) => i !== idx));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);

        try {
            if (!nom.trim()) {
                setErrors(["Le nom du menu est requis"]);
                return;
            }

            if (!dateService) {
                setErrors(["La date de service est requise"]);
                return;
            }

            const menuPayload: CreateMenuRequest = {
                nom: nom.trim(),
                description: description.trim() || undefined,
                dateService,
                nombrePortions: Number(nombrePortions) || 1,
                prixVente: Number(prixVente) || undefined,
                items: items.map((i) => ({
                    produitId: i.produitId ?? 0,
                    nom: i.nom,
                    unite: i.unite,
                    quantite: i.quantite,
                    prixUnitaire: i.prixUnitaire,
                })),
            };

            const newMenu = await createMenu.mutateAsync(menuPayload);
            if (items.length > 0 && newMenu?.id) {
                
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];

                    const mapUniteToBackend = (unite: string): string => {
                        switch (unite.toUpperCase()) {
                            case 'KG':
                            case 'KILOGRAMME':
                                return 'KILOGRAMME';
                            case 'G':
                            case 'GRAMME':
                                return 'GRAMME';
                            case 'L':
                            case 'LITRE':
                                return 'LITRE';
                            case 'ML':
                            case 'MILLILITRE':
                                return 'MILLILITRE';
                            case 'PIECE':
                            case 'PIECES':
                                return 'PIECE';
                            case 'UNITE':
                            case 'UNITES':
                                return 'UNITE';
                            default:
                                console.warn(` ${unite}`);
                                return 'PIECE';
                        }
                    };
                    
                    const ingredientPayload: AddIngredientRequest = {
                        produitId: item.produitId || 0,
                        quantiteNecessaire: item.quantite,
                        uniteUtilisee: mapUniteToBackend(item.unite),
                        notes: `Ingredient: ${item.nom} - Prix unitaire: ${item.prixUnitaire}€`
                    };
                    
                    
                    try {
                        await addIngredientToMenu.mutateAsync({ 
                            menuId: newMenu.id, 
                            ingredient: ingredientPayload 
                        });
                    } catch (ingredientError: unknown) {
                        console.error(` Error agregando ingrediente ${i + 1} (${item.nom}):`, {
                            error: ingredientError,
                            response: (ingredientError as unknown as {response?: {data?: unknown}})?.response?.data,
                            status: (ingredientError as unknown as {response?: {status?: number}})?.response?.status
                        });
                    }
                }
            }

            setNom("");
            setDescription("");
            setDateService("");
            setPrixVente("");
            setNombrePortions("");
            setItems([]);
            setErrors([]);

        } catch (error: unknown) {
            console.error(error);
            const errorMessage = (error as unknown as {response?: {data?: {message?: string}}, message?: string})?.response?.data?.message || (error as unknown as {message?: string})?.message || "Erreur lors de la création du menu";
            setErrors([errorMessage]);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
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
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Salade César"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date de service *
                    </label>
                    <input
                        type="date"
                        value={dateService}
                        onChange={(e) => setDateService(e.target.value)}
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description du menu..."
                    rows={2}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de portions
                    </label>
                    <input
                        type="number"
                        value={nombrePortions}
                        onChange={(e) => setNombrePortions(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        placeholder="Nombre de portions"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix de vente (€)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        value={prixVente}
                        onChange={(e) => setPrixVente(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        placeholder="Prix de vente"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">
                        Ingrédients ({items.length})
                    </h3>
                    <button
                        type="button"
                        onClick={addItem}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                        Ajouter un ingrédient
                    </button>
                </div>

                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center bg-gray-50 p-3 rounded-md">
                            <div>
                                <select
                                    value={item.produitId || ""}
                                    onChange={(e) => {
                                        const produitId = Number(e.target.value);
                                        const produit = produitsArray.find((p: {id: number}) => p.id === produitId);
                                        if (produit) {
                                            updateItem(idx, {
                                                produitId,
                                                nom: produit.nom,
                                                unite: produit.unite || 'PIECE',
                                                prixUnitaire: produit.prixUnitaire || 0
                                            });
                                        }
                                    }}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    disabled={isProduitsLoading}
                                >
                                    <option value="">{isProduitsLoading ? "Chargement..." : "Sélectionner un produit"}</option>
                                    {produitsArray.map((produit: {id: number, nom: string, unite?: string}) => (
                                        <option key={produit.id} value={produit.id}>
                                            {produit.nom} ({produit.unite || 'unité'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <input
                                    type="number"
                                    step="0.001"
                                    value={item.quantite}
                                    onChange={(e) => updateItem(idx, { quantite: Number(e.target.value) })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                    placeholder="Quantité"
                                />
                            </div>
                            
                            <div>
                                <span className="text-sm text-gray-600">{item.unite}</span>
                            </div>
                            
                            <div>
                                <span className="text-sm text-gray-600">
                                    {formatEUR(item.prixUnitaire)}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                    {formatEUR(item.prixUnitaire * item.quantite)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeItem(idx)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {items.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <div className="text-sm text-gray-600">
                            Coût total estimé des ingrédients: <strong>{formatEUR(total)}</strong>
                        </div>
                        {Number(prixVente) > 0 && (
                            <p className="text-sm text-gray-600">
                                Marge estimée: <strong>{formatEUR(Number(prixVente) - total)}</strong>
                                <span className="ml-2">
                                    ({(((Number(prixVente) - total) / Number(prixVente)) * 100).toFixed(1)}%)
                                </span>
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={createMenu.isPending || addIngredientToMenu.isPending}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {(createMenu.isPending || addIngredientToMenu.isPending) ? "Création en cours..." : "Créer le menu"}
                </button>
            </div>
        </form>
    );
}