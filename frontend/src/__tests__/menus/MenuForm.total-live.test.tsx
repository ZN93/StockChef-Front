import { renderWithClient } from "../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuForm from "../../features/menus/MenuForm";

function matchEuro(text: string) {
    // tolère virgule/point et espace insécable
    return /3[,.]80/.test(text);
}

test("calcule le coût total en live (prix unitaire × quantité)", async () => {
    renderWithClient(<MenuForm />);

    // Nom pas nécessaire pour calcul, on se concentre sur la ligne d’ingrédient
    await userEvent.click(screen.getByRole("button", { name: /\+ ingrédient/i }));

    // Choisir "Farine" (id=1) → prix unitaire auto = 1.9, unité = kg (via nos handlers MSW)
    const select = await screen.findByLabelText(/produit #1/i);
    await userEvent.selectOptions(select, "1");

    // Attendre l’auto-remplissage
    await waitFor(() => {
        expect(screen.getByLabelText(/ingrédient #1 prix unitaire/i)).toHaveValue(1.9);
    });

    // Saisir quantité 2
    const qte = screen.getByLabelText(/quantité #1/i);
    await userEvent.clear(qte);
    await userEvent.type(qte, "2");

    // Le total doit afficher 3,80 € (format FR) — on reste souple sur ,/.
    const totalNode = await screen.findByTestId("menu-total");
    expect(totalNode).toBeInTheDocument();
    expect(totalNode).toHaveTextContent(/total/i);
    expect(matchEuro(totalNode.textContent || "")).toBe(true); // ≈ 3,80
});
