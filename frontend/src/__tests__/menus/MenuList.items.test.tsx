import { renderWithClient } from "../test-utils";
import { screen } from "@testing-library/react";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";
import MenuList from "../../features/menus/MenuList";

beforeAll(() => {
    server.use(
        http.get("*/api/menus", () =>
            HttpResponse.json({
                content: [
                    {
                        id: 1,
                        nom: "Menu du jour",
                        coutTotal: 4.0,
                        items: [
                            { produitId: 1, nom: "Farine", unite: "kg", quantite: 2, prixUnitaire: 1.0 },
                            { produitId: 2, nom: "Lait UHT", unite: "L", quantite: 1, prixUnitaire: 2.0 },
                        ],
                    },
                ],
                page: 0, size: 20, totalElements: 1,
            })
        )
    );
});

test("affiche les items d'un menu (nom — quantité unité)", async () => {
    renderWithClient(<MenuList />);
    // Attendre le nom du menu
    expect(await screen.findByText(/Menu du jour/i)).toBeInTheDocument();

    // Les ingrédients doivent apparaître lisibles dans la ligne
    expect(screen.getByText(/Farine — 2 kg/i)).toBeInTheDocument();
    expect(screen.getByText(/Lait UHT — 1 L/i)).toBeInTheDocument();
});
