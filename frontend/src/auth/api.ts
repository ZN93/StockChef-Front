import { authApi } from "../api/client";

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

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    const resp = await authApi.post<LoginResponse>("/auth/login", payload);
    return resp.data;
}
