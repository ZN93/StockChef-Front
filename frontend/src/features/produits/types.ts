// Tipos actualizados para coincidir con backend real
export type Produit = {
    id: number;
    nom: string;
    quantiteStock: number; // Cambiado de 'quantite'
    unite: 'KILOGRAMME' | 'PIECE' | 'LITRE' | 'GRAMME'; // Enum específico
    prixUnitaire: number;
    seuilAlerte: number; // Nuevo campo
    datePeremption: string; // ISO string
    description: string; // Nuevo campo
    dateCreation?: string;
    dateModification?: string;
};

// Para compatibilidad con el componente de lista (si es necesario)
export type Page<T> = {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
};

// Tipo para crear nuevos productos
export type NewProduit = {
    nom: string;
    quantiteInitiale: number; // Para creación
    unite: 'KILOGRAMME' | 'PIECE' | 'LITRE' | 'GRAMME';
    prixUnitaire: number;
    seuilAlerte: number;
    datePeremption: string; // Requerido
    description: string; // Requerido
};

// Tipo para consumir productos
export type ConsommerProduitRequest = {
    quantite: number;
    motif?: string;
};

// Tipo para resumen de inventario
export type InventorySummary = {
    totalProduits: number;
    totalCategories: number;
    produitsProchesExpiration: number;
    produitsStockBas: number;
};
