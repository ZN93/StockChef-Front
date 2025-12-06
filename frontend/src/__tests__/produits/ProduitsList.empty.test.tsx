import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProduitsList from "../../features/produits/ProduitsList";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";

test("rend une ligne produit", async () => {
    server.use(
        http.get("*/api/produits", () =>
            HttpResponse.json({
                content: [
                    { id:1, nom:"Farine", quantite:18, unite:"kg", prixUnitaire:1.9, dateEntree:"2025-08-15", datePeremption:"2025-10-15" }
                ],
                page:0, size:20, totalElements:1
            })
        )
    );

    const qc = new QueryClient();
    render(<QueryClientProvider client={qc}><ProduitsList/></QueryClientProvider>);

    expect(await screen.findByText(/Farine/i)).toBeInTheDocument();
});