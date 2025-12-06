export type MenuItem = {
    produitId: number;
    nom: string;
    unite: string;
    quantite: number;
    prixUnitaire: number;
};

export type Menu = {
    id: number;
    nom: string;
    items: MenuItem[];
    coutTotal: number;
};

export type NewMenu = Omit<Menu, "id" | "coutTotal">;
