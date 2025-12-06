import { http, HttpResponse } from "msw";

export const rapportsHandlers = [
    http.get("*/api/rapports", ({ request }) => {
        const url = new URL(request.url);
        const from = url.searchParams.get("from");
        const to = url.searchParams.get("to");

        console.log("[MSW] GET /api/rapports", { from, to });

        return HttpResponse.json({
            coutMoyen: 3.8,
            nbDepassements: 2,
        });
    }),
];
