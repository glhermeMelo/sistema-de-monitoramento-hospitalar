import { api } from '../api/client';

export interface LeituraPacienteResponse {
    idLeitura: number;
    idSensor: number;
    idPaciente: number;
    dataLeitura: string;
    temperaturaCorporal: number;
    spo2: number;
    bpm: number;
}

export interface LeituraAmbienteResponse {
    idLeitura: number;
    idSensor: number;
    numeroLeito: number;
    dataLeitura: string;
    temperaturaAmbiente?: number;
    umidade?: number;
    [key: string]: unknown;
}

export const leituraService = {
    async listarPorPaciente(idPaciente: number): Promise<LeituraPacienteResponse[]> {
        const { data } = await api.get<LeituraPacienteResponse[]>(
            `/pacientes/${idPaciente}/leituras`
        );
        return data;
    },

    async listarPorLeito(numeroLeito: number): Promise<LeituraAmbienteResponse[]> {
        const { data } = await api.get<LeituraAmbienteResponse[]>(
            `/leitos/${numeroLeito}/leituras`
        );
        return data;
    },
};