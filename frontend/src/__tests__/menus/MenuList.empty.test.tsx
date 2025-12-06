import { renderWithClient } from "../test-utils";
import { screen } from "@testing-library/react";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";
import MenuList from "../../features/menus/MenuList";

// Pour CE test: /api/menus renvoie une page vide
beforeAll(() => {
    server.use(
        http.get("*/api/menus", () =>
            HttpResponse.json({ content: [], page: 0, size: 20, totalElements: 0 })
        )
    );
});

test("affiche 'Aucun menu' si vide", async () => {
    renderWithClient(<MenuList />);
    expect(await screen.findByText(/Aucun menu/i)).toBeInTheDocument();
});
