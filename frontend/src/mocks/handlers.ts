import { http, HttpResponse } from "msw";

const produits = [
    { id:1, nom:"Farine", quantite:18, unite:"kg", prixUnitaire:1.9, dateEntree:"2025-08-15", datePeremption:"2025-10-15" }
];

export const handlers = [
    http.get("/api/produits", () =>
        HttpResponse.json({ content: produits, page:0, size:20, totalElements: produits.length })
    ),
];
