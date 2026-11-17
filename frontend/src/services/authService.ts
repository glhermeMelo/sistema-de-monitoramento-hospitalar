import { api, TOKEN_STORAGE_KEY } from '../api/client';
import type { AuthRequest, AuthResponse } from '../types/auth';

export const authService = {
    async login(credentials: AuthRequest): Promise<string> {
        const { data } = await api.post<AuthResponse>('/auth/login', credentials);
        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        return data.token;
    },

    logout(): void {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    },

    getToken(): string | null {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    },

    isAuthenticated(): boolean {
        return Boolean(localStorage.getItem(TOKEN_STORAGE_KEY));
    },
};