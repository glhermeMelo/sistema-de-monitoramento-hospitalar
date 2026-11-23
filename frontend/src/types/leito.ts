export type StatusLeito = 'OCUPADO' | 'LIVRE' | 'MANUTENCAO';

export interface LeitoResponse {
    numeroLeito: number;
    localizacao: string;
    statusLeito: StatusLeito;
    idPaciente?: number | null;
    nomePaciente?: string | null;
}

export interface LeitoRequest {
    numeroLeito: number;
    localizacao: string;
    statusLeito?: StatusLeito;
    idPaciente?: number | null;
}

export interface LeitoPatchRequest {
    numeroLeito?: number;
    localizacao?: string;
    statusLeito?: StatusLeito;
}