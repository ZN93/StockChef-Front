import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "../mocks/server"; // 👈 assure-toi que ce chemin existe

// --- Config MSW pour les tests ---
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// --- Wrapper React Query ---
const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
            },
        },
    });

// Permet de rendre des composants avec le QueryClientProvider
export const wrapper = (ui: React.ReactElement) => {
    const client = createTestQueryClient();
    return (
        <QueryClientProvider client={client}>
            {ui}
        </QueryClientProvider>
    );
};

// Option : helper de rendu direct (comme @testing-library/react.render)
export function renderWithClient(ui: React.ReactElement) {
    const client = createTestQueryClient();
    const { rerender, ...result } = render(
        <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    );
    return {
        ...result,
        rerender: (rerenderUi: React.ReactElement) =>
            rerender(<QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>),
    };
}
