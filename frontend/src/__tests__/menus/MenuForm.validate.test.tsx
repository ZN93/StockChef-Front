import { renderWithClient } from "../test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuForm from "../../features/menus/MenuForm";

test("affiche des messages si le formulaire est invalide", async () => {
    renderWithClient(<MenuForm />);

    // Soumettre sans rien
    await userEvent.click(screen.getByRole("button", { name: /enregistrer/i }));

    // Messages attendus
    expect(await screen.findByText(/le nom est requis/i)).toBeInTheDocument();
    expect(screen.getByText(/au moins un ingrédient/i)).toBeInTheDocument();

    // Ajoute 1 ingrédient mais quantité 0 => erreur quantité
    await userEvent.click(screen.getByRole("button", { name: /\+ ingrédient/i }));
    expect(screen.queryByText(/au moins un ingrédient/i)).not.toBeInTheDocument();

    // quantité #1 à 0 => erreur
    const qteInput = screen.getByLabelText(/quantité #1/i);
    await userEvent.clear(qteInput);
    await userEvent.type(qteInput, "0");
    await userEvent.click(screen.getByRole("button", { name: /enregistrer/i }));
    expect(await screen.findByText(/chaque quantité doit être > 0/i)).toBeInTheDocument();
});
