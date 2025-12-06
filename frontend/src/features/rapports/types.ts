export type RapportsParams = {
    from?: string; // "YYYY-MM-DD"
    to?: string;   // "YYYY-MM-DD"
};

export type RapportSynthese = {
    coutMoyen: number;       // coût moyen des menus sur la période
    nbDepassements: number;  // nombre de menus qui dépassent le budget
};
