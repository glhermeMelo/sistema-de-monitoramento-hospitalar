export interface PacienteResponse {
    idPaciente: number;
    nome: string;
    cpf?: string;
    dataNascimento: string;
    sexo?: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    setorLeito?: string;
    numeroLeito?: string;
    statusManual?: 'Estável' | 'Atenção' | 'Crítico';
    observacoes?: string;
}

export interface PacienteRequest {
    nome: string;
    cpf: string;
    dataNascimento: string; // dd/MM/yyyy
}