import { api } from '../api/client';
import type { LeitoPatchRequest, LeitoRequest, LeitoResponse } from '../types/leito';

export const leitoService = {
    async listar(): Promise<LeitoResponse[]> {
        const { data } = await api.get<LeitoResponse[]>('/leitos');
        return data;
    },

    async detalhar(numeroLeito: number): Promise<LeitoResponse> {
        const { data } = await api.get<LeitoResponse>(`/leitos/${numeroLeito}`);
        return data;
    },

    async cadastrar(payload: LeitoRequest): Promise<LeitoResponse> {
        const { data } = await api.post<LeitoResponse>('/leitos', payload);
        return data;
    },

    async atualizarTotal(numeroLeito: number, payload: LeitoRequest): Promise<LeitoResponse> {
        const { data } = await api.put<LeitoResponse>(`/leitos/${numeroLeito}`, payload);
        return data;
    },

    async atualizarParcial(numeroLeito: number, payload: LeitoPatchRequest): Promise<LeitoResponse> {
        const { data } = await api.patch<LeitoResponse>(`/leitos/${numeroLeito}`, payload);
        return data;
    },

    async remover(numeroLeito: number): Promise<void> {
        await api.delete(`/leitos/${numeroLeito}`);
    },
};