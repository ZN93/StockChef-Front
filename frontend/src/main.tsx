import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import AppRoutes from "./AppRoutes";

// 1. Création du client React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
        },
    },
});

async function enableMocks() {
    if (import.meta.env.DEV) {
        const { worker } = await import("./mocks/browser");
        await worker.start({
            serviceWorker: {
                url: "/mockServiceWorker.js",
            },
            onUnhandledRequest: "warn",
        });
        console.log("[MSW] ready before render");
    }
}

async function bootstrap() {
    await enableMocks();

    ReactDOM.createRoot(
        document.getElementById("root") as HTMLElement
    ).render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <AppRoutes />
            </QueryClientProvider>
        </React.StrictMode>
    );
}

bootstrap();
