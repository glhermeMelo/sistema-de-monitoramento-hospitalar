export type CargoUsuario = 'MEDICO' | 'ENFERMAGEM' | 'MANUTENCAO' | 'ADMIN';

export interface UsuarioResponse {
    nome: string;
    cpf?: string;
    login: string;
    cargo?: CargoUsuario;
}

export interface CpfCadastradoRequest {
    cpf: string;
    cargo: CargoUsuario;
    idAdmin: number;
    dataLimiteHabilitado: string; // YYYY-MM-DD
}

export interface CpfCadastradoResponse {
    cpf: string;
    cargo: CargoUsuario;
    dataLimiteHabilitado?: string;
}

export interface UsuarioCreateRequest {
    nome: string;
    cpf: string;
    login: string;
    senha: string;
}

export interface UsuarioPatchRequest {
    login?: string;
    senha?: string;
}