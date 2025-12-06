import { renderWithClient } from "../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";
import MenuForm from "../../features/menus/MenuForm";
import MenuList from "../../features/menus/MenuList";

// Pour ce test : 2 produits en catalogue
beforeAll(() => {
    server.use(
        http.get("*/api/produits", ({ request }) => {
            return HttpResponse.json({
                content: [
                    { id: 1, nom: "Farine", quantite: 18, unite: "kg", prixUnitaire: 1.9, dateEntree: "x", datePeremption: "x" },
                    { id: 2, nom: "Lait UHT", quantite: 10, unite: "L", prixUnitaire: 0.85, dateEntree: "x", datePeremption: "x" },
                ],
                page: 0, size: 20, totalElements: 2,
            });
        })
    );
});

test("sélection d’un produit → auto-remplit unité et prix, puis submit OK", async () => {
    renderWithClient(<><MenuForm /><MenuList /></>);

    // Nom du menu
    await userEvent.type(screen.getByLabelText(/nom du menu/i), "Menu grains");

    // + une ligne ingrédient
    await userEvent.click(screen.getByRole("button", { name: /\+ ingrédient/i }));

    // Attendre que les options produits soient chargées dans le select de la ligne #1
    const select = await screen.findByLabelText(/produit #1/i);

    // Choisir "Farine"
    await userEvent.selectOptions(select, "1"); // value = id du produit

    // L’unité et le prix u. doivent s’auto-remplir
    await waitFor(() => {
        expect(screen.getByLabelText(/ingrédient #1 unité/i)).toHaveValue("kg");
        expect(screen.getByLabelText(/ingrédient #1 prix unitaire/i)).toHaveValue(1.9);
    });

    // Saisir la quantité
    await userEvent.clear(screen.getByLabelText(/quantité #1/i));
    await userEvent.type(screen.getByLabelText(/quantité #1/i), "2");

    // Submit
    await userEvent.click(screen.getByRole("button", { name: /enregistrer/i }));

    // Le menu doit apparaître dans la liste
    expect(await screen.findByText(/menu grains/i)).toBeInTheDocument();
});
