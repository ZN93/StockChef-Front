import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import AppRoutes from "./AppRoutes";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
        },
    },
});

async function bootstrap() {
     ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <AppRoutes />
            </QueryClientProvider>
        </React.StrictMode>
    );
}

bootstrap();

