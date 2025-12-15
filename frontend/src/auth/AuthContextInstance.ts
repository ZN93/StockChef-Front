import { createContext } from "react";
import type { AuthContextValue } from "./AuthContextValue";

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);