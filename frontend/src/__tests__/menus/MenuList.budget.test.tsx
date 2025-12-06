import { renderWithClient } from "../test-utils";
import { screen } from "@testing-library/react";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";
import MenuList from "../../features/menus/MenuList";

// Pour CE test, 2 menus dont un dépasse le seuil 4.5 €
beforeAll(() => {
    server.use(
        http.get("*/api/menus", () =>
            HttpResponse.json({
                content: [
                    { id: 1, nom: "Menu Économique", items: [], coutTotal: 3.2 },
                    { id: 2, nom: "Repas Luxueux",  items: [], coutTotal: 5.5 },
                ],
                page: 0, size: 20, totalElements: 2,
            })
        )
    );
});

test("affiche un badge budget (OK / Dépassement) en fonction du seuil", async () => {
    renderWithClient(<MenuList seuilBudget={4.5} />);

    // Attendre le 1er rendu data
    expect(await screen.findByText(/Menu Économique/i)).toBeInTheDocument();

    // Badge OK pour 3.2 <= 4.5
    expect(screen.getByText(/Budget OK/i)).toBeInTheDocument();

    // Badge Dépassement pour 5.5 > 4.5
    expect(screen.getByText(/Dépassement/i)).toBeInTheDocument();
});
