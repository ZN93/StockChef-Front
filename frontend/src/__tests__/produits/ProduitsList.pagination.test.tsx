import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProduitsList from "../../features/produits/ProduitsList";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

// util pour wrapper
function renderWithRQ(ui: React.ReactNode) {
    const qc = new QueryClient();
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

// fabrique 25 produits
const mk = (n: number) => Array.from({ length: n }, (_, i) => ({
    id: i + 1, nom: `Produit ${i + 1}`, quantite: 10, unite: "u",
    prixUnitaire: 1.5, dateEntree: "2025-09-01", datePeremption: "2025-12-01"
}));

test("pagination: 20 items en page 1, 5 en page 2", async () => {
    // Handler paginé
    server.use(
        http.get("*/api/produits", ({ request }) => {
            const url = new URL(request.url);
            const page = Number(url.searchParams.get("page") ?? 0);
            const size = Number(url.searchParams.get("size") ?? 20);

            const all = mk(25);
            const start = page * size;
            const slice = all.slice(start, start + size);

            return HttpResponse.json({
                content: slice,
                page,
                size,
                totalElements: all.length,
            });
        })
    );

    renderWithRQ(<ProduitsList />);

    // Page 1 : 20 lignes visibles
    // (juste un échantillon pour ne pas être fragile)
    expect(await screen.findByText("Produit 1")).toBeInTheDocument();
    expect(screen.getByText("Produit 20")).toBeInTheDocument();
    expect(screen.queryByText("Produit 21")).not.toBeInTheDocument();

    // Aller à la page suivante
    await userEvent.click(screen.getByRole("button", { name: /suivant/i }));

    // Page 2 : 5 lignes restantes
    expect(await screen.findByText("Produit 21")).toBeInTheDocument();
    expect(screen.queryByText("Produit 20")).not.toBeInTheDocument();
    expect(screen.getByText("Produit 25")).toBeInTheDocument();

    // "Suivant" doit être désactivé en dernière page
    expect(screen.getByRole("button", { name: /suivant/i })).toBeDisabled();

    // Revenir à la page précédente
    await userEvent.click(screen.getByRole("button", { name: /précédent/i }));
    expect(await screen.findByText("Produit 1")).toBeInTheDocument();
});

test("le bouton 'Précédent' est désactivé sur la première page", async () => {
    server.use(
        http.get("*/api/produits", () =>
            HttpResponse.json({
                content: Array.from({ length: 5 }, (_, i) => ({
                    id: i + 1,
                    nom: `Produit ${i + 1}`,
                    quantite: 10,
                    unite: "u",
                    prixUnitaire: 1.5,
                    dateEntree: "2025-09-01",
                    datePeremption: "2025-12-01",
                })),
                page: 0,
                size: 20,
                totalElements: 5,
            }))
    );

    renderWithRQ(<ProduitsList />);

    // attendre le rendu initial
    expect(await screen.findByText("Produit 1")).toBeInTheDocument();

    // vérifier l'état du bouton
    const prevButton = screen.getByRole("button", { name: /précédent/i });
    expect(prevButton).toBeDisabled();

    // et "Suivant" doit être activé s’il y a des pages restantes (ici non)
    const nextButton = screen.getByRole("button", { name: /suivant/i });
    expect(nextButton).toBeDisabled();
});

test("le bouton 'Suivant' est désactivé sur la dernière page", async () => {
    // Simule 25 produits => 2 pages (20 + 5)
    server.use(
        http.get("*/api/produits", ({ request }) => {
            const url = new URL(request.url);
            const page = Number(url.searchParams.get("page") ?? 0);
            const size = Number(url.searchParams.get("size") ?? 20);

            const all = Array.from({ length: 25 }, (_, i) => ({
                id: i + 1,
                nom: `Produit ${i + 1}`,
                quantite: 10,
                unite: "u",
                prixUnitaire: 1.5,
                dateEntree: "2025-09-01",
                datePeremption: "2025-12-01",
            }));

            const slice = all.slice(page * size, page * size + size);
            return HttpResponse.json({
                content: slice,
                page,
                size,
                totalElements: all.length,
            });
        })
    );

    renderWithRQ(<ProduitsList />);

    // attendre le rendu initial (page 0)
    expect(await screen.findByText("Produit 1")).toBeInTheDocument();

    // Aller à la dernière page (page 1)
    const nextButton = screen.getByRole("button", { name: /suivant/i });
    await userEvent.click(nextButton);

    // Vérifier que "Suivant" est maintenant désactivé
    expect(await screen.findByRole("button", { name: /suivant/i })).toBeDisabled();

    // Et "Précédent" doit être actif
    expect(screen.getByRole("button", { name: /précédent/i })).toBeEnabled();
});
