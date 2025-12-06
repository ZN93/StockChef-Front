import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProduitForm from "../../features/produits/ProduitForm";

function renderWithRQ(ui: React.ReactNode) {
    const qc = new QueryClient();
    return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

test("affiche des messages si le formulaire est invalide", async () => {
    renderWithRQ(<ProduitForm />);

    // Submit sans rien saisir
    await userEvent.click(screen.getByRole("button", { name: /enregistrer/i }));

    // Messages attendus
    expect(await screen.findByText(/le nom est requis/i)).toBeInTheDocument();
    expect(screen.getByText(/la quantité doit être ≥ 0/i)).toBeInTheDocument();
    expect(screen.getByText(/le prix doit être ≥ 0/i)).toBeInTheDocument();

    // Dates incohérentes
    await userEvent.type(screen.getByLabelText(/date d'entrée/i), "2025-10-10");
    await userEvent.type(screen.getByLabelText(/date de péremption/i), "2025-10-01");
    await userEvent.click(screen.getByRole("button", { name: /enregistrer/i }));
    expect(await screen.findByText(/la date de péremption doit être après la date d'entrée/i)).toBeInTheDocument();
});
