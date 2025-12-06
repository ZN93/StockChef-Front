import { renderWithClient } from "../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProduitsList from "../../features/produits/ProduitsList";
import { vi } from "vitest";

vi.mock("../../features/produits/useDebounce", () => ({
    useDebounce: (v: string) => v,
}));

test("filtre par nom avec l'input recherche", async () => {
    renderWithClient(<ProduitsList />);

    // Attendre les données initiales
    expect(await screen.findByText(/Farine/i)).toBeInTheDocument();
    expect(screen.getByText(/Lait/i)).toBeInTheDocument();

    // Tape "far" → refetch immédiat (pas de debounce en test)
    await userEvent.type(screen.getByPlaceholderText(/Rechercher/i), "far");

    // Attendre que la liste filtrée s'affiche
    expect(await screen.findByText(/Farine/i)).toBeInTheDocument();
    await waitFor(() =>
        expect(screen.queryByText(/Lait/i)).not.toBeInTheDocument()
    );
});
