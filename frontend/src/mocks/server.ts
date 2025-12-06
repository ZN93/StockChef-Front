import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// MSW pour l'environnement de test (Node/jsdom)
export const server = setupServer(...handlers);
