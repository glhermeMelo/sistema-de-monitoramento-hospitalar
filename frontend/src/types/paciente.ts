export interface PacienteResponse {
    idPaciente: number;
    nome: string;
    dataNascimento: string;
}

export interface PacienteRequest {
    nome: string;
    cpf: string;
    dataNascimento: string; // Enviar no formato dd/MM/yyyy exigido pelo @JsonFormat
}