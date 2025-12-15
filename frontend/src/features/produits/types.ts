export type Produit = {
    id: number;
    nom: string;
    quantiteStock: number;
    unite: 'KILOGRAMME' | 'PIECE' | 'LITRE' | 'GRAMME';
    prixUnitaire: number;
    seuilAlerte: number;
    datePeremption: string;
    description: string;
    dateCreation?: string;
    dateModification?: string;
};

export type Page<T> = {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
};

export type NewProduit = {
    nom: string;
    quantiteInitiale: number;
    unite: 'KILOGRAMME' | 'PIECE' | 'LITRE' | 'GRAMME';
    prixUnitaire: number;
    seuilAlerte: number;
    datePeremption: string;
    description: string;
};

export type ConsommerProduitRequest = {
    quantite: number;
    motif?: string;
};

export type EditProduitRequest = {
    nom?: string;
    prixUnitaire?: number;
    seuilAlerte?: number;
    datePeremption?: string;
    description?: string;
};

export type InventorySummary = {
    totalProduits: number;
    totalCategories: number;
    produitsProchesExpiration: number;
    produitsStockBas: number;
};
