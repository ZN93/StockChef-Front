import { api } from "../api/client.ts";

export type LoginPayload = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    email: string;
    fullName: string;
    role: string;
    expiresIn: number;
};

export async function loginApi(credentials: { email: string; password: string }) {
    const { data } = await api.post<LoginResponse>("/auth/login", credentials);
    return data;
}

