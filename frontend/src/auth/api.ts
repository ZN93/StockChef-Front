import { authApi, apiClient } from "../api/client";

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

export type RegisterPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type RegisterResponse = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    effectiveRole: string;
    isActive: boolean;
    createdAt: string;
    lastLoginAt?: string;
    createdBy: string;
};

export type UserProfile = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    role: string;
    effectiveRole: string;
    isActive: boolean;
    createdAt: string;
    lastLoginAt?: string;
    updatedAt?: string;
};

export type UpdateProfilePayload = {
    firstName: string;
    lastName: string;
    email: string;
};

export type ChangePasswordPayload = {
    currentPassword: string;
    newPassword: string;
};

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    const resp = await authApi.post<LoginResponse>("/auth/login", payload);
    return resp.data;
}

export async function registerApi(payload: RegisterPayload): Promise<RegisterResponse> {
    const resp = await authApi.post<RegisterResponse>("/users/register", payload);
    return resp.data;
}

export async function getUserProfileApi(): Promise<UserProfile> {
    const resp = await apiClient.get<UserProfile>("/users/me");
    return resp.data;
}

export async function updateProfileApi(payload: UpdateProfilePayload): Promise<UserProfile> {
    // First get current user to get the ID
    const currentUser = await getUserProfileApi();
    const resp = await apiClient.put<UserProfile>(`/users/${currentUser.id}`, payload);
    return resp.data;
}

export async function changePasswordApi(payload: ChangePasswordPayload): Promise<void> {
    await apiClient.post("/users/change-password", payload);
}
