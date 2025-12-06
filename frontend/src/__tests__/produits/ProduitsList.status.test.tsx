import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProduitsList from "../../features/produits/ProduitsList";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

const wrapper = (ui: React.ReactNode) => (
    <QueryClientProvider client={new QueryClient()}>{ui}</QueryClientProvider>
);

test("affiche 'Périmé' si date < aujourd'hui", async () => {
    server.use(
        http.get("*/api/produits", () =>
            HttpResponse.json({
                content: [
                    { id:1, nom:"Beurre", quantite:5, unite:"kg", prixUnitaire:7.2, dateEntree:"2025-08-25", datePeremption:"2020-01-01" }
                ],
                page:0, size:20, totalElements:1
            })
        )
    );

    render(wrapper(<ProduitsList />));
    expect(await screen.findByText(/Périmé/i)).toBeInTheDocument();
});
