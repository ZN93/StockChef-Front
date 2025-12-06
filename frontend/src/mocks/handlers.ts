import { http, HttpResponse } from "msw";
import type { Produit, NewProduit } from "../features/produits/types";
import type { Menu, NewMenu } from "../features/menus/types";
import { rapportsHandlers } from "./handlers-rapports";

/** -----------------------
 *  Produits (mémoire)
 *  ----------------------*/
let autoId = 1000;
const ALL: Produit[] = [
    { id: 1, nom: "Farine",  quantite: 18, unite: "kg", prixUnitaire: 1.9,  dateEntree: "2025-08-15", datePeremption: "2025-10-15" },
    { id: 2, nom: "Lait UHT",quantite: 10, unite: "L",  prixUnitaire: 0.85, dateEntree: "2025-09-01", datePeremption: "2025-09-10" },
    { id: 3, nom: "Oeufs",   quantite: 120,unite: "u",  prixUnitaire: 0.15, dateEntree: "2025-09-05", datePeremption: "2025-09-20" },
    { id: 4, nom: "Beurre",  quantite: 5,  unite: "kg", prixUnitaire: 7.2,  dateEntree: "2025-08-25", datePeremption: "2020-09-07" },
];

/** -----------------------
 *  Menus (mémoire)
 *  ----------------------*/
let MENUS: Menu[] = [];
let autoMenuId = 1;

/** -----------------------
 *  Handlers
 *  ----------------------*/
export const handlers = [
    // --- PRODUITS ---
    http.get("*/api/produits", ({ request }) => {
        const url = new URL(request.url);
        const page   = Number(url.searchParams.get("page") ?? 0);
        const size   = Number(url.searchParams.get("size") ?? 20);
        const search = (url.searchParams.get("search") ?? "").toLowerCase();

        const filtered = search
            ? ALL.filter(p => p.nom.toLowerCase().includes(search))
            : ALL;

        const slice = filtered.slice(page * size, page * size + size);

        console.log("[MSW] GET /api/produits", { page, size, search, count: slice.length });

        return HttpResponse.json({
            content: slice,
            page,
            size,
            totalElements: filtered.length,
        });
    }),

    http.post("*/api/produits", async ({ request }) => {
        const body = (await request.json()) as NewProduit;

        if (!body?.nom?.trim() || typeof body.quantite !== "number" || typeof body.prixUnitaire !== "number" || !body.unite) {
            return HttpResponse.json({ message: "Données invalides" }, { status: 400 });
        }

        const created: Produit = {
            id: autoId++,
            nom: body.nom,
            quantite: body.quantite,
            unite: body.unite,
            prixUnitaire: body.prixUnitaire,
            dateEntree: body.dateEntree ?? "2025-01-01",
            ...(body.datePeremption ? { datePeremption: body.datePeremption } : {}),
        };

        ALL.unshift(created);
        return HttpResponse.json(created, { status: 201 });
    }),

    // --- MENUS ---
    http.get("*/api/menus", ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") ?? 0);
        const size = Number(url.searchParams.get("size") ?? 20);
        const slice = MENUS.slice(page * size, page * size + size);

        console.log("[MSW] GET /api/menus", { page, size, count: slice.length });

        return HttpResponse.json({
            content: slice,
            page,
            size,
            totalElements: MENUS.length,
        });
    }),

    http.post("*/api/menus", async ({ request }) => {
        const body = (await request.json()) as NewMenu;

        if (!body?.nom?.trim() || !Array.isArray(body.items) || body.items.length === 0) {
            return HttpResponse.json({ message: "Données invalides" }, { status: 400 });
        }
        if (body.items.some(i => typeof i.quantite !== "number" || i.quantite <= 0)) {
            return HttpResponse.json({ message: "Quantités invalides" }, { status: 400 });
        }

        const coutTotal = body.items.reduce((acc, i) => acc + i.quantite * i.prixUnitaire, 0);
        const created: Menu = { id: autoMenuId++, nom: body.nom, items: body.items, coutTotal };

        MENUS.unshift(created);
        return HttpResponse.json(created, { status: 201 });
    }),

    // --- RAPPORTS ---
        ...rapportsHandlers,
];

/** -----------------------
 *  Utilitaire pour tests
 *  ----------------------*/
// à appeler dans les tests si besoin de repartir à zéro
export function __resetMenus() {
    MENUS = [];
    autoMenuId = 1;
}
