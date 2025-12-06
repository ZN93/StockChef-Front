import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { wrapper } from "../test-utils"; // ton provider React Query + MSW
import ProduitForm from "../../features/produits/ProduitForm";
import ProduitsList from "../../features/produits/ProduitsList";

test("soumet un produit valide, l'ajoute et la liste se met à jour", async () => {
    render(wrapper(
        <div>
            <ProduitForm />
            <ProduitsList />
        </div>
    ));

    await userEvent.type(screen.getByLabelText(/nom/i), "Riz");
    await userEvent.type(screen.getByLabelText(/quantité/i), "3");
    await userEvent.type(screen.getByLabelText(/prix unitaire/i), "1.2");
    // unité a peut-être une valeur par défaut "u", sinon remplir
    // dates optionnelles selon ton form

    await userEvent.click(screen.getByRole("button", { name: /enregistrer/i }));

    // la liste se rafraîchit (invalidatesQuery) et affiche "Riz"
    expect(await screen.findByText(/Riz/i)).toBeInTheDocument();
});
