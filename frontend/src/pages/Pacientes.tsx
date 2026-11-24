import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Plus,
    SquarePen,
    Trash2,
    X,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { api } from '../api/client';
import { pacienteService } from '../services/pacienteService';
import { leituraService } from '../services/leituraService';
import type { PacienteResponse } from '../types/paciente';

type StatusClinicoPaciente = 'Estável' | 'Atenção' | 'Crítico';

interface PacienteExtras {
    cpf?: string;
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
    statusManual?: StatusClinicoPaciente;
    observacoes?: string;
    nomeEditado?: string;
    dataNascimentoEditada?: string;
}

interface PacienteComStatus extends PacienteResponse {
    statusClinico: StatusClinicoPaciente;
    isLocalSeed?: boolean;
}

interface LeitoSimples {
    numeroLeito: number;
    localizacao: string;
    statusLeito?: string;
}

const STORAGE_EXTRAS_KEY = 'smh_pacientes_extras_v1';
const STORAGE_SEED_KEY = 'smh_pacientes_seed_v1';

const ESTADOS_BR = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const SETORES_PADRAO = ['Ala A', 'Ala B', 'Ala C', 'UTI', 'Enfermaria'];
const LEITOS_PADRAO = ['A01', 'A02', 'A03', 'B01', 'B02', 'B03', 'B04', 'C01', 'UTI-01'];

const PACIENTES_INICIAIS: PacienteComStatus[] = [
    {
        idPaciente: 101,
        nome: 'Ana Santos',
        cpf: '529.982.247-25',
        dataNascimento: '1992-04-15',
        sexo: 'FEMININO',
        telefone: '(84) 99912-3401',
        email: 'ana.santos@email.com',
        endereco: 'Rua das Flores',
        numero: '123',
        complemento: 'Apto 101',
        bairro: 'Centro',
        cidade: 'Mossoró',
        estado: 'RN',
        cep: '59600-010',
        setorLeito: 'Ala A',
        numeroLeito: 'A03',
        statusClinico: 'Estável',
        observacoes: 'Pós-operatório sem intercorrências. Sinais vitais estáveis.',
        isLocalSeed: true,
    },
    {
        idPaciente: 102,
        nome: 'Maria Barros',
        cpf: '111.444.777-35',
        dataNascimento: '1978-09-22',
        sexo: 'FEMININO',
        telefone: '(84) 99845-1120',
        email: 'maria.barros@email.com',
        endereco: 'Av. Alberto Maranhão',
        numero: '1450',
        complemento: 'Casa',
        bairro: 'Alto de São Manoel',
        cidade: 'Mossoró',
        estado: 'RN',
        cep: '59631-000',
        setorLeito: 'Ala A',
        numeroLeito: 'A02',
        statusClinico: 'Atenção',
        observacoes: 'Monitorar frequência cardíaca e saturação a cada 2 horas.',
        isLocalSeed: true,
    },
    {
        idPaciente: 103,
        nome: 'João Silva',
        cpf: '390.533.447-05',
        dataNascimento: '1965-11-03',
        sexo: 'MASCULINO',
        telefone: '(84) 99123-8899',
        email: 'joao.silva@email.com',
        endereco: 'Rua Frei Miguelinho',
        numero: '88',
        complemento: '',
        bairro: 'Doze Anos',
        cidade: 'Mossoró',
        estado: 'RN',
        cep: '59603-350',
        setorLeito: 'Ala A',
        numeroLeito: 'A01',
        statusClinico: 'Crítico',
        observacoes: 'Paciente em observação intensiva. Alérgico a dipirona.',
        isLocalSeed: true,
    },
    {
        idPaciente: 104,
        nome: 'Lucas Alves',
        cpf: '714.287.938-60',
        dataNascimento: '1999-01-30',
        sexo: 'MASCULINO',
        telefone: '(84) 99402-7761',
        email: 'lucas.alves@email.com',
        endereco: 'Rua Melo Franco',
        numero: '412',
        complemento: 'Bloco B',
        bairro: 'Nova Betânia',
        cidade: 'Mossoró',
        estado: 'RN',
        cep: '59607-120',
        setorLeito: 'Ala B',
        numeroLeito: 'B01',
        statusClinico: 'Estável',
        observacoes: 'Hidratação venosa em andamento. Boa resposta clínica.',
        isLocalSeed: true,
    },
    {
        idPaciente: 105,
        nome: 'Vinícius Costa',
        cpf: '853.512.490-04',
        dataNascimento: '1986-07-11',
        sexo: 'MASCULINO',
        telefone: '(84) 98871-5540',
        email: 'vinicius.costa@email.com',
        endereco: 'Rua Coronel Gurgel',
        numero: '310',
        complemento: '',
        bairro: 'Centro',
        cidade: 'Mossoró',
        estado: 'RN',
        cep: '59600-200',
        setorLeito: 'Ala B',
        numeroLeito: 'B03',
        statusClinico: 'Atenção',
        observacoes: 'Pico febril registrado pela manhã. Segue em acompanhamento.',
        isLocalSeed: true,
    },
    {
        idPaciente: 106,
        nome: 'Juliana Reis',
        cpf: '468.923.150-98',
        dataNascimento: '1995-12-08',
        sexo: 'FEMININO',
        telefone: '(84) 99633-2019',
        email: 'juliana.reis@email.com',
        endereco: 'Rua Juvenal Lamartine',
        numero: '720',
        complemento: 'Apto 204',
        bairro: 'Santo Antônio',
        cidade: 'Mossoró',
        estado: 'RN',
        cep: '59611-040',
        setorLeito: 'Ala B',
        numeroLeito: 'B04',
        statusClinico: 'Estável',
        observacoes: 'Previsão de alta médica para amanhã pela manhã.',
        isLocalSeed: true,
    },
    {
        idPaciente: 107,
        nome: 'Gustavo Marques',
        cpf: '629.184.730-15',
        dataNascimento: '1981-05-19',
        sexo: 'MASCULINO',
        telefone: '(84) 99710-4482',
        email: 'gustavo.marques@email.com',
        endereco: 'Av. Rio Branco',
        numero: '905',
        complemento: '',
        bairro: 'Santa Delmira',
        cidade: 'Mossoró',
        estado: 'RN',
        cep: '59615-300',
        setorLeito: 'Ala C',
        numeroLeito: 'C01',
        statusClinico: 'Atenção',
        observacoes: 'Hipertenso. Pressão arterial e BPM sob monitoramento contínuo.',
        isLocalSeed: true,
    },
];

const statusBadgeStyles: Record<StatusClinicoPaciente, string> = {
    Estável: 'bg-emerald-50 text-emerald-600',
    Atenção: 'bg-amber-50 text-amber-600',
    Crítico: 'bg-red-100 text-red-600',
};

const statusSelectStyles: Record<StatusClinicoPaciente, string> = {
    Estável: 'border-emerald-400 bg-emerald-50/40 text-emerald-700',
    Atenção: 'border-amber-400 bg-amber-50/40 text-amber-700',
    Crítico: 'border-red-400 bg-red-50/40 text-red-700',
};

// Funções de máscara para inputs numéricos
function formatarCPF(valor: string): string {
    const digits = valor.replace(/\D/g, '').slice(0, 11);
    return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatarTelefone(valor: string): string {
    const digits = valor.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatarCEP(valor: string): string {
    const digits = valor.replace(/\D/g, '').slice(0, 8);
    return digits.replace(/(\d{5})(\d)/, '$1-$2');
}

function formatarApenasNumeros(valor: string): string {
    return valor.replace(/\D/g, '');
}

function obterPacientesSeed(): PacienteComStatus[] {
    try {
        const raw = localStorage.getItem(STORAGE_SEED_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_SEED_KEY, JSON.stringify(PACIENTES_INICIAIS));
            return PACIENTES_INICIAIS;
        }
        return JSON.parse(raw);
    } catch {
        return PACIENTES_INICIAIS;
    }
}

function salvarPacientesSeed(lista: PacienteComStatus[]) {
    localStorage.setItem(STORAGE_SEED_KEY, JSON.stringify(lista));
}

function lerExtrasStorage(): Record<number, PacienteExtras> {
    try {
        const raw = localStorage.getItem(STORAGE_EXTRAS_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function salvarExtrasStorage(idPaciente: number, extras: PacienteExtras) {
    const atual = lerExtrasStorage();
    atual[idPaciente] = { ...atual[idPaciente], ...extras };
    localStorage.setItem(STORAGE_EXTRAS_KEY, JSON.stringify(atual));
}

function removerExtrasStorage(idPaciente: number) {
    const atual = lerExtrasStorage();
    delete atual[idPaciente];
    localStorage.setItem(STORAGE_EXTRAS_KEY, JSON.stringify(atual));
}

function calcularStatusClinico(
    temp?: number,
    bpm?: number,
    spo2?: number
): StatusClinicoPaciente {
    if (temp === undefined && bpm === undefined && spo2 === undefined) {
        return 'Estável';
    }
    if (
        (temp !== undefined && (temp >= 38.5 || temp < 35.0)) ||
        (spo2 !== undefined && spo2 < 90) ||
        (bpm !== undefined && (bpm > 120 || bpm < 45))
    ) {
        return 'Crítico';
    }
    if (
        (temp !== undefined && temp >= 37.6) ||
        (spo2 !== undefined && spo2 < 95) ||
        (bpm !== undefined && (bpm > 100 || bpm < 55))
    ) {
        return 'Atenção';
    }
    return 'Estável';
}

function formatarDataParaBackend(isoDate: string): string {
    if (!isoDate) return '';
    if (isoDate.includes('/')) return isoDate;
    const [ano, mes, dia] = isoDate.split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarDataParaInput(data: string): string {
    if (!data) return '';
    if (data.includes('-')) return data;
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
}

export function Pacientes() {
    const [pacientes, setPacientes] = useState<PacienteComStatus[]>([]);
    const [leitosApi, setLeitosApi] = useState<LeitoSimples[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtroSetor, setFiltroSetor] = useState<string>('TODOS');
    const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 7;

    // Modais
    const [modalFormAberto, setModalFormAberto] = useState(false);
    const [pacienteEditando, setPacienteEditando] =
        useState<PacienteComStatus | null>(null);
    const [pacienteParaExcluir, setPacienteParaExcluir] =
        useState<PacienteComStatus | null>(null);

    // Campos do Formulário
    const [nome, setNome] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [sexo, setSexo] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('RN');
    const [cep, setCep] = useState('');
    const [setorSelecionado, setSetorSelecionado] = useState('Ala A');
    const [numeroLeito, setNumeroLeito] = useState('');
    const [statusForm, setStatusForm] = useState<StatusClinicoPaciente>('Estável');
    const [observacoes, setObservacoes] = useState('');

    const [salvando, setSalvando] = useState(false);
    const [erroForm, setErroForm] = useState('');
    const [erroExclusao, setErroExclusao] = useState('');

    async function carregarDados() {
        setLoading(true);
        try {
            const [listaPacientesApi, resLeitos] = await Promise.all([
                pacienteService.listar().catch(() => [] as PacienteResponse[]),
                api.get<LeitoSimples[]>('/leitos').catch(() => ({ data: [] as LeitoSimples[] })),
            ]);

            setLeitosApi(Array.isArray(resLeitos.data) ? resLeitos.data : []);
            const extrasMap = lerExtrasStorage();

            const enriquecidosApi: PacienteComStatus[] = await Promise.all(
                listaPacientesApi.map(async (p) => {
                    const extras = extrasMap[p.idPaciente] ?? {};
                    let statusCalculado: StatusClinicoPaciente = 'Estável';

                    try {
                        const leituras = await leituraService.listarPorPaciente(p.idPaciente);
                        const ultima = leituras[leituras.length - 1];
                        statusCalculado = calcularStatusClinico(
                            ultima?.temperaturaCorporal,
                            ultima?.bpm,
                            ultima?.spo2
                        );
                    } catch {
                        statusCalculado = 'Estável';
                    }

                    return {
                        ...p,
                        ...extras,
                        nome: extras.nomeEditado || p.nome,
                        dataNascimento: extras.dataNascimentoEditada || p.dataNascimento,
                        statusClinico: extras.statusManual || statusCalculado,
                        isLocalSeed: false,
                    };
                })
            );

            const seeds = obterPacientesSeed();
            setPacientes([...enriquecidosApi, ...seeds]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    const setoresDisponiveis = useMemo(() => {
        if (leitosApi.length > 0) {
            const set = new Set(leitosApi.map((l) => l.localizacao).filter(Boolean));
            return Array.from(set).sort();
        }
        return SETORES_PADRAO;
    }, [leitosApi]);

    const leitosDisponiveis = useMemo(() => {
        if (leitosApi.length > 0) {
            return leitosApi
                .filter((l) => !setorSelecionado || l.localizacao === setorSelecionado)
                .map((l) => `Leito ${String(l.numeroLeito).padStart(2, '0')}`);
        }
        return LEITOS_PADRAO;
    }, [leitosApi, setorSelecionado]);

    function abrirModalNovo() {
        setPacienteEditando(null);
        setNome('');
        setDataNascimento('');
        setSexo('');
        setCpf('');
        setTelefone('');
        setEmail('');
        setEndereco('');
        setNumero('');
        setComplemento('');
        setBairro('');
        setCidade('');
        setEstado('RN');
        setCep('');
        setSetorSelecionado(setoresDisponiveis[0] ?? 'Ala A');
        setNumeroLeito('');
        setStatusForm('Estável');
        setObservacoes('');
        setErroForm('');
        setModalFormAberto(true);
    }

    function abrirModalEditar(p: PacienteComStatus) {
        setPacienteEditando(p);
        setNome(p.nome);
        setDataNascimento(formatarDataParaInput(p.dataNascimento));
        setSexo(p.sexo ?? '');
        setCpf(formatarCPF(p.cpf ?? ''));
        setTelefone(formatarTelefone(p.telefone ?? ''));
        setEmail(p.email ?? '');
        setEndereco(p.endereco ?? '');
        setNumero(formatarApenasNumeros(p.numero ?? ''));
        setComplemento(p.complemento ?? '');
        setBairro(p.bairro ?? '');
        setCidade(p.cidade ?? '');
        setEstado(p.estado ?? 'RN');
        setCep(formatarCEP(p.cep ?? ''));
        setSetorSelecionado(p.setorLeito ?? setoresDisponiveis[0] ?? 'Ala A');
        setNumeroLeito(p.numeroLeito ?? '');
        setStatusForm(p.statusClinico);
        setObservacoes(p.observacoes ?? '');
        setErroForm('');
        setModalFormAberto(true);
    }

    const pacientesFiltrados = useMemo(() => {
        return pacientes.filter((p) => {
            const matchNome = p.nome.toLowerCase().includes(busca.toLowerCase());
            const matchStatus =
                filtroStatus === 'TODOS' || p.statusClinico === filtroStatus;
            const matchSetor =
                filtroSetor === 'TODOS' || p.setorLeito === filtroSetor;
            return matchNome && matchStatus && matchSetor;
        });
    }, [pacientes, busca, filtroStatus, filtroSetor]);

    const totalPaginas = Math.max(
        1,
        Math.ceil(pacientesFiltrados.length / itensPorPagina)
    );
    const pacientesPaginados = pacientesFiltrados.slice(
        (paginaAtual - 1) * itensPorPagina,
        paginaAtual * itensPorPagina
    );

    async function handleSalvarPaciente(e: FormEvent) {
        e.preventDefault();
        setErroForm('');
        setSalvando(true);

        const extras: PacienteExtras = {
            cpf: formatarCPF(cpf),
            sexo,
            telefone: formatarTelefone(telefone),
            email: email.trim(),
            endereco: endereco.trim(),
            numero: formatarApenasNumeros(numero),
            complemento: complemento.trim(),
            bairro: bairro.trim(),
            cidade: cidade.trim(),
            estado,
            cep: formatarCEP(cep),
            setorLeito: setorSelecionado,
            numeroLeito,
            statusManual: statusForm,
            observacoes: observacoes.trim(),
        };

        try {
            if (pacienteEditando) {
                if (pacienteEditando.isLocalSeed) {
                    const seeds = obterPacientesSeed().map((item) =>
                        item.idPaciente === pacienteEditando.idPaciente
                            ? {
                                ...item,
                                ...extras,
                                nome: nome.trim(),
                                dataNascimento,
                                statusClinico: statusForm,
                            }
                            : item
                    );
                    salvarPacientesSeed(seeds);
                } else {
                    salvarExtrasStorage(pacienteEditando.idPaciente, {
                        ...extras,
                        nomeEditado: nome.trim(),
                        dataNascimentoEditada: dataNascimento,
                    });
                }
            } else {
                try {
                    const criado = await pacienteService.cadastrar({
                        nome: nome.trim(),
                        cpf: cpf.replace(/\D/g, ''),
                        dataNascimento: formatarDataParaBackend(dataNascimento),
                    });
                    salvarExtrasStorage(criado.idPaciente, extras);
                } catch {
                    const seedsAtuais = obterPacientesSeed();
                    const novoPacienteLocal: PacienteComStatus = {
                        idPaciente: Date.now(),
                        nome: nome.trim(),
                        cpf: formatarCPF(cpf),
                        dataNascimento,
                        sexo,
                        telefone: formatarTelefone(telefone),
                        email: email.trim(),
                        endereco: endereco.trim(),
                        numero: formatarApenasNumeros(numero),
                        complemento: complemento.trim(),
                        bairro: bairro.trim(),
                        cidade: cidade.trim(),
                        estado,
                        cep: formatarCEP(cep),
                        setorLeito: setorSelecionado,
                        numeroLeito,
                        statusClinico: statusForm,
                        observacoes: observacoes.trim(),
                        isLocalSeed: true,
                    };
                    salvarPacientesSeed([novoPacienteLocal, ...seedsAtuais]);
                }
            }

            setModalFormAberto(false);
            setPaginaAtual(1);
            await carregarDados();
        } finally {
            setSalvando(false);
        }
    }

    async function handleExcluirPaciente() {
        if (!pacienteParaExcluir) return;
        setErroExclusao('');
        setSalvando(true);

        try {
            if (pacienteParaExcluir.isLocalSeed) {
                const seedsAtualizados = obterPacientesSeed().filter(
                    (item) => item.idPaciente !== pacienteParaExcluir.idPaciente
                );
                salvarPacientesSeed(seedsAtualizados);
            } else {
                await pacienteService.remover(pacienteParaExcluir.idPaciente);
                removerExtrasStorage(pacienteParaExcluir.idPaciente);
            }

            setPacienteParaExcluir(null);
            await carregarDados();
        } catch (err: any) {
            setErroExclusao(
                err.response?.data?.message ||
                'Não foi possível excluir o paciente. Verifique se há leito ou sensores vinculados.'
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
            </div>

            {/* Barra de Filtros e Ação */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-64">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => {
                                setBusca(e.target.value);
                                setPaginaAtual(1);
                            }}
                            placeholder="Buscar paciente..."
                            className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#0E9F9E] focus:outline-none"
                        />
                    </div>

                    <select
                        value={filtroSetor}
                        onChange={(e) => {
                            setFiltroSetor(e.target.value);
                            setPaginaAtual(1);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-[#0E9F9E] focus:outline-none"
                    >
                        <option value="TODOS">Todos os setores</option>
                        {setoresDisponiveis.map((setor) => (
                            <option key={setor} value={setor}>
                                {setor}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filtroStatus}
                        onChange={(e) => {
                            setFiltroStatus(e.target.value);
                            setPaginaAtual(1);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-[#0E9F9E] focus:outline-none"
                    >
                        <option value="TODOS">Todos os status</option>
                        <option value="Estável">Estável</option>
                        <option value="Atenção">Atenção</option>
                        <option value="Crítico">Crítico</option>
                    </select>
                </div>

                <button
                    onClick={abrirModalNovo}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0e9f9e] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0B8281]"
                >
                    <Plus className="h-4 w-4" />
                    Novo paciente
                </button>
            </div>

            {/* Tabela de Pacientes */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                {loading ? (
                    <div className="flex h-64 items-center justify-center text-slate-500">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#0e9f9e]" />
                        Carregando pacientes...
                    </div>
                ) : pacientesPaginados.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            Nenhum paciente encontrado.
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Cadastre um novo paciente usando o botão acima.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-3.5">Nome</th>
                                <th className="px-6 py-3.5">Setor</th>
                                <th className="px-6 py-3.5">Leito</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {pacientesPaginados.map((paciente) => (
                                <tr
                                    key={paciente.idPaciente}
                                    className="transition-colors hover:bg-slate-50/70"
                                >
                                    <td className="px-6 py-4 font-semibold text-slate-800">
                                        <Link
                                            to={`/pacientes/${paciente.idPaciente}`}
                                            className="hover:text-[#0e9f9e] hover:underline"
                                        >
                                            {paciente.nome}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {paciente.setorLeito || '-'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#143B59]">
                                        {paciente.numeroLeito || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                      <span
                          className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${
                              statusBadgeStyles[paciente.statusClinico]
                          }`}
                      >
                        {paciente.statusClinico}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => abrirModalEditar(paciente)}
                                                title="Editar dados do paciente"
                                                className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-100"
                                            >
                                                <SquarePen className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setErroExclusao('');
                                                    setPacienteParaExcluir(paciente);
                                                }}
                                                title="Dar alta / Excluir paciente"
                                                className="cursor-pointer rounded-lg bg-red-50 p-1.5 text-red-600 transition-colors hover:bg-red-100"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Paginação */}
                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 text-xs text-slate-500">
          <span>
            Exibindo {pacientesPaginados.length} de {pacientesFiltrados.length}{' '}
              pacientes
          </span>

                    <div className="flex items-center gap-2">
            <span>
              {paginaAtual} de {totalPaginas} páginas
            </span>
                        <button
                            disabled={paginaAtual <= 1}
                            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                            className="cursor-pointer rounded-md border border-slate-200 p-1 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            disabled={paginaAtual >= totalPaginas}
                            onClick={() =>
                                setPaginaAtual((p) => Math.min(totalPaginas, p + 1))
                            }
                            className="cursor-pointer rounded-md border border-slate-200 p-1 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal: Adicionar / Editar Paciente */}
            {modalFormAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
                    <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">
                                {pacienteEditando ? 'Editar paciente' : 'Adicionar paciente'}
                            </h2>
                            <button
                                onClick={() => setModalFormAberto(false)}
                                className="cursor-pointer rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {erroForm && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                                {erroForm}
                            </div>
                        )}

                        <form onSubmit={handleSalvarPaciente} className="space-y-4">
                            <p className="text-xs font-bold text-slate-800">Dados pessoais</p>

                            {/* Linha 1: Nome completo | Data de nascimento | Sexo */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                                <div className="sm:col-span-6">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Nome completo
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        placeholder="Digite o nome completo"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Data de nascimento
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={dataNascimento}
                                        onChange={(e) => setDataNascimento(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Sexo
                                    </label>
                                    <select
                                        value={sexo}
                                        onChange={(e) => setSexo(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="FEMININO">Feminino</option>
                                        <option value="MASCULINO">Masculino</option>
                                        <option value="OUTRO">Outro</option>
                                    </select>
                                </div>
                            </div>

                            {/* Linha 2: CPF | Telefone | E-mail */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                                <div className="sm:col-span-4">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={14}
                                        required={!pacienteEditando}
                                        disabled={Boolean(pacienteEditando && cpf)}
                                        value={cpf}
                                        onChange={(e) => setCpf(formatarCPF(e.target.value))}
                                        placeholder="000.000.000-00"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none disabled:bg-slate-50"
                                    />
                                </div>

                                <div className="sm:col-span-4">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Telefone
                                    </label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={15}
                                        value={telefone}
                                        onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                                        placeholder="(84) 99999-9999"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    />
                                </div>

                                <div className="sm:col-span-4">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ana.santos@email.com"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Linha 3: Endereço | Número | Complemento */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                                <div className="sm:col-span-7">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Endereço
                                    </label>
                                    <input
                                        type="text"
                                        value={endereco}
                                        onChange={(e) => setEndereco(e.target.value)}
                                        placeholder="Rua das Flores"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Número
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={numero}
                                        onChange={(e) => setNumero(formatarApenasNumeros(e.target.value))}
                                        placeholder="123"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Complemento
                                    </label>
                                    <input
                                        type="text"
                                        value={complemento}
                                        onChange={(e) => setComplemento(e.target.value)}
                                        placeholder="Apto 101"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Linha 4: Bairro | Cidade | Estado | CEP */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                                <div className="sm:col-span-4">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Bairro
                                    </label>
                                    <input
                                        type="text"
                                        value={bairro}
                                        onChange={(e) => setBairro(e.target.value)}
                                        placeholder="Centro"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    />
                                </div>

                                <div className="sm:col-span-4">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Cidade
                                    </label>
                                    <input
                                        type="text"
                                        value={cidade}
                                        onChange={(e) => setCidade(e.target.value)}
                                        placeholder="Mossoró"
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Estado
                                    </label>
                                    <select
                                        value={estado}
                                        onChange={(e) => setEstado(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    >
                                        {ESTADOS_BR.map((uf) => (
                                            <option key={uf} value={uf}>
                                                {uf}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        CEP
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={9}
                                        value={cep}
                                        onChange={(e) => setCep(formatarCEP(e.target.value))}
                                        placeholder="59600-000"
                                        className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Informações Clínicas */}
                            <p className="pt-2 text-xs font-bold text-slate-800">
                                Informações clínicas
                            </p>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Setor
                                    </label>
                                    <select
                                        value={setorSelecionado}
                                        onChange={(e) => {
                                            setSetorSelecionado(e.target.value);
                                            setNumeroLeito('');
                                        }}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    >
                                        {setoresDisponiveis.map((setor) => (
                                            <option key={setor} value={setor}>
                                                {setor}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Leito
                                    </label>
                                    <select
                                        value={numeroLeito}
                                        onChange={(e) => setNumeroLeito(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                    >
                                        <option value="">Selecione</option>
                                        {leitosDisponiveis.map((leito) => (
                                            <option key={leito} value={leito}>
                                                {leito}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Status
                                    </label>
                                    <select
                                        value={statusForm}
                                        onChange={(e) =>
                                            setStatusForm(e.target.value as StatusClinicoPaciente)
                                        }
                                        className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold focus:outline-none ${statusSelectStyles[statusForm]}`}
                                    >
                                        <option value="Estável">Estável</option>
                                        <option value="Atenção">Atenção</option>
                                        <option value="Crítico">Crítico</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Observações
                                </label>
                                <textarea
                                    rows={3}
                                    value={observacoes}
                                    onChange={(e) => setObservacoes(e.target.value)}
                                    placeholder="Anotações clínicas, alergias ou histórico..."
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-[#0e9f9e] focus:outline-none"
                                />
                            </div>

                            <div className="mt-5 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalFormAberto(false)}
                                    className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="cursor-pointer rounded-lg bg-[#071422] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0D1F33] disabled:opacity-60"
                                >
                                    {salvando ? 'Salvando...' : 'Salvar alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Excluir / Dar Alta */}
            {pacienteParaExcluir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <Trash2 className="h-5 w-5" />
                        </div>

                        <h2 className="text-lg font-bold text-slate-900">Excluir paciente</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Tem certeza que deseja dar alta e excluir o paciente{' '}
                            <strong className="text-slate-900">
                                {pacienteParaExcluir.nome}
                            </strong>
                            ?
                        </p>

                        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-left text-xs text-red-700">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                Esta ação não pode ser desfeita. Certifique-se de que o paciente
                não possui leito ocupado nem sensores vinculados.
              </span>
                        </div>

                        {erroExclusao && (
                            <div className="mt-3 rounded-lg border border-red-300 bg-red-100 px-3 py-2 text-xs font-medium text-red-800">
                                {erroExclusao}
                            </div>
                        )}

                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                onClick={() => setPacienteParaExcluir(null)}
                                className="cursor-pointer rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleExcluirPaciente}
                                disabled={salvando}
                                className="cursor-pointer rounded-lg bg-[#DC2626] px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {salvando ? 'Excluindo...' : 'Excluir paciente'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}