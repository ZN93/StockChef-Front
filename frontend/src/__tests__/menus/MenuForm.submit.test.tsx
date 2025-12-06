import { renderWithClient } from "../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuForm from "../../features/menus/MenuForm";
import MenuList from "../../features/menus/MenuList";

test("soumet un menu valide et la liste se met à jour", async () => {
    renderWithClient(
        <>
            <MenuForm />
            <MenuList />
        </>
    );

    await userEvent.type(screen.getByLabelText(/nom du menu/i), "Menu du jour");

    // + ligne ingrédient
    await userEvent.click(screen.getByRole("button", { name: /\+ ingrédient/i }));

    // Choisir un produit existant (ex: Farine id=1)
    const select = await screen.findByLabelText(/produit #1/i);
    await userEvent.selectOptions(select, "1");

    // Attendre l’auto-remplissage unité/prix
    await waitFor(() => {
        expect(screen.getByLabelText(/ingrédient #1 unité/i)).toHaveValue("kg");
        expect(screen.getByLabelText(/ingrédient #1 prix unitaire/i)).toHaveValue(1.9);
    });

    // Quantité
    await userEvent.clear(screen.getByLabelText(/quantité #1/i));
    await userEvent.type(screen.getByLabelText(/quantité #1/i), "2");

    // Submit
    await userEvent.click(screen.getByRole("button", { name: /enregistrer/i }));

    // Menu visible dans la liste
    expect(await screen.findByText(/menu du jour/i)).toBeInTheDocument();
});
