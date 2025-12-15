export type MenuIngredient = {
    id: number;
    produitId: number;
    produitNom: string;
    quantiteNecessaire: number;
    uniteUtilisee: string;
    quantiteConvertieStockUnit: number;
    coutIngredient: number;
    notes?: string;
    stockSuffisant: boolean;
    quantiteManquante?: number;
};

export type Menu = {
    id: number;
    nom: string;
    description?: string;
    dateService: string;
    dateCreation: string;
    dateModification: string;
    statut: 'BROUILLON' | 'CONFIRME' | 'REALISE' | 'ANNULE';
    prixVente: number;
    coutTotalIngredients: number;
    marge: number;
    margePercentage: number;
    peutEtrePrepare: boolean;
    ingredients: MenuIngredient[];
    nombreIngredients: number;
    nombreIngredientsManquants: number;
    nombrePortions?: number;
    chefResponsable?: string;
};

export type CreateMenuRequest = {
    nom: string;
    description?: string;
    dateService: string;
    nombrePortions?: number;
    prixVente?: number;
    chefResponsable?: string;
    items: Array<{
        produitId: number;
        nom: string;
        unite: string;
        quantite: number;
        prixUnitaire: number;
    }>;
};

export type EditMenuRequest = {
    nom: string;
    description?: string;
    dateService: string;
    nombrePortions?: number;
    prixVente?: number;
    chefResponsable?: string;
};

export type AddIngredientRequest = {
    produitId: number;
    quantiteNecessaire: number;
    uniteUtilisee: string;
    notes?: string;
};
