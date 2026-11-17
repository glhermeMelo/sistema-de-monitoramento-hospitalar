export type StatusLeito = 'OCUPADO' | 'LIVRE' | 'MANUTENCAO';

export interface LeitoResponse {
    numeroLeito: number;
    localizacao: string;
    statusLeito: StatusLeito;
}

export interface LeitoRequest {
    numeroLeito: number;
    localizacao: string;
    statusLeito?: StatusLeito;
}

export interface LeitoPatchRequest {
    localizacao?: string;
    statusLeito?: StatusLeito;
}