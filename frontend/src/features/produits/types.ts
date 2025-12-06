export type Produit = {
    id: number;
    nom: string;
    quantite: number;
    unite: string;
    prixUnitaire: number;
    dateEntree: string;
    datePeremption?: string;
};

export type Page<T> = {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
};

export type NewProduit = {
    nom: string;
    quantite: number;
    unite: string;
    prixUnitaire: number;
    dateEntree?: string;
    datePeremption?: string;
};
