// Estructura de ingrediente de menú según API
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

// Estructura de menú según API
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

// Para crear un nuevo menú
export type CreateMenuRequest = {
    nom: string;
    description?: string;
    dateService: string;
    nombrePortions?: number;
    prixVente?: number;
    chefResponsable?: string;
};

// Para editar un menú
export type EditMenuRequest = {
    nom: string;
    description?: string;
    dateService: string;
    nombrePortions?: number;
    prixVente?: number;
    chefResponsable?: string;
};

// Para agregar ingredientes a un menú
export type AddIngredientRequest = {
    produitId: number;
    quantiteNecessaire: number;
    uniteUtilisee: string;
    notes?: string;
};
