import { renderWithClient } from "../test-utils";
import { screen } from "@testing-library/react";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";
import MenuList from "../../features/menus/MenuList";

// Pour CE test, on renvoie 2 menus
beforeAll(() => {
    server.use(
        http.get("*/api/menus", () =>
            HttpResponse.json({
                content: [
                    { id: 1, nom: "Menu Économique", items: [], coutTotal: 3.2 },
                    { id: 2, nom: "Repas Luxueux",  items: [], coutTotal: 5.5 },
                ],
                page: 0,
                size: 20,
                totalElements: 2,
            })
        )
    );
});

test("affiche 2 menus avec leur nom et coût total", async () => {
    renderWithClient(<MenuList />);

    // Noms
    expect(await screen.findByText(/Menu Économique/i)).toBeInTheDocument();
    expect(screen.getByText(/Repas Luxueux/i)).toBeInTheDocument();

    // Coûts (on vérifie juste les valeurs brutes pour l’instant)
    expect(screen.getByText("3.2")).toBeInTheDocument();
    expect(screen.getByText("5.5")).toBeInTheDocument();
});
