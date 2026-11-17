import { api } from '../api/client';
import type { PacienteRequest, PacienteResponse } from '../types/paciente';

export const pacienteService = {
    async listar(): Promise<PacienteResponse[]> {
        const { data } = await api.get<PacienteResponse[]>('/pacientes');
        return data;
    },

    async detalhar(idPaciente: number): Promise<PacienteResponse> {
        const { data } = await api.get<PacienteResponse>(`/pacientes/${idPaciente}`);
        return data;
    },

    async cadastrar(payload: PacienteRequest): Promise<PacienteResponse> {
        const { data } = await api.post<PacienteResponse>('/pacientes', payload);
        return data;
    },

    async remover(idPaciente: number): Promise<void> {
        await api.delete(`/pacientes/${idPaciente}`);
    },
};