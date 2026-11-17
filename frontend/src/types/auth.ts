export interface AuthRequest {
    login: string;
    senha: string;
}

export interface AuthResponse {
    token: string;
}