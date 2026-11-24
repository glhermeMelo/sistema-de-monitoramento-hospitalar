import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    BedDouble,
    Eye,
    AlertTriangle,
    AlertCircle,
    Info,
    ArrowRight,
    Loader2,
} from 'lucide-react';
import { leitoService } from '../services/leitoService';
import { pacienteService } from '../services/pacienteService';
import type { LeitoResponse } from '../types/leito';
import type { PacienteResponse } from '../types/paciente';

type SeveridadeAlerta = 'critico' | 'atencao' | 'info';
type StatusCardLeito = 'Normal' | 'Atenção' | 'Crítico' | 'Livre';

interface AlertaRecente {
    id: string;
    titulo: string;
    descricao: string;
    tempo: string;
    severidade: SeveridadeAlerta;
}

interface PacienteLocalResumo extends PacienteResponse {
    setorLeito?: string;
    numeroLeito?: string;
    statusClinico?: 'Estável' | 'Atenção' | 'Crítico';
}

interface CardLeitoDashboard {
    codigo: string;
    ocupante: string;
    status: StatusCardLeito;
}

const STORAGE_SEED_KEY = 'smh_pacientes_seed_v1';

const CODIGOS_LEITOS_PAINEL = [
    'A01', 'A02', 'A03', 'A04',
    'B01', 'B02', 'B03', 'B04',
    'C01', 'C02', 'C03', 'C04',
];

const OCUPACAO_BASE: Record<string, { ocupante: string; status: StatusCardLeito }> = {
    A01: { ocupante: 'João Silva', status: 'Crítico' },
    A02: { ocupante: 'Maria Barros', status: 'Atenção' },
    A03: { ocupante: 'Ana Santos', status: 'Normal' },
    A04: { ocupante: 'Vago', status: 'Livre' },
    B01: { ocupante: 'Lucas Alves', status: 'Normal' },
    B02: { ocupante: 'Vago', status: 'Livre' },
    B03: { ocupante: 'Vinícius Costa', status: 'Atenção' },
    B04: { ocupante: 'Juliana Reis', status: 'Normal' },
    C01: { ocupante: 'Gustavo Marques', status: 'Atenção' },
    C02: { ocupante: 'Beatriz Lima', status: 'Normal' },
    C03: { ocupante: 'Vago', status: 'Livre' },
    C04: { ocupante: 'Rafael Martins', status: 'Atenção' },
};

const badgeLeitoStyles: Record<StatusCardLeito, string> = {
    Normal: 'bg-emerald-50 text-emerald-600',
    Atenção: 'bg-amber-50 text-amber-600',
    Crítico: 'bg-red-100 text-red-600',
    Livre: 'bg-slate-100 text-slate-500',
};

const tituloAlertaStyles: Record<SeveridadeAlerta, string> = {
    critico: 'text-[#DC2626]',
    atencao: 'text-[#D97706]',
    info: 'text-[#2563EB]',
};

function lerPacientesLocais(): PacienteLocalResumo[] {
    try {
        const raw = localStorage.getItem(STORAGE_SEED_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function Dashboard() {
    const [leitosApi, setLeitosApi] = useState<LeitoResponse[]>([]);
    const [cardsLeitos, setCardsLeitos] = useState<CardLeitoDashboard[]>([]);
    const [pacientes, setPacientes] = useState<PacienteLocalResumo[]>([]);
    const [alertas, setAlertas] = useState<AlertaRecente[]>([]);
    const [loading, setLoading] = useState(true);

    async function carregarDadosDashboard() {
        try {
            const [leitosRes, pacientesRes] = await Promise.allSettled([
                leitoService.listar(),
                pacienteService.listar(),
            ]);

            const listaLeitosApi =
                leitosRes.status === 'fulfilled' ? leitosRes.value : [];
            const listaPacientesApi =
                pacientesRes.status === 'fulfilled' ? pacientesRes.value : [];

            setLeitosApi(listaLeitosApi);

            const pacientesLocais = lerPacientesLocais();
            const todosPacientes: PacienteLocalResumo[] = [
                ...listaPacientesApi,
                ...pacientesLocais,
            ];
            setPacientes(todosPacientes);

            const mapaPacientesPorLeito = new Map<string, PacienteLocalResumo>();
            pacientesLocais.forEach((p) => {
                if (p.numeroLeito) {
                    mapaPacientesPorLeito.set(p.numeroLeito.trim().toUpperCase(), p);
                }
            });

            const gridLeitos: CardLeitoDashboard[] = CODIGOS_LEITOS_PAINEL.map(
                (codigo) => {
                    const pacienteNoLeito = mapaPacientesPorLeito.get(codigo);
                    if (pacienteNoLeito) {
                        const statusMap: Record<string, StatusCardLeito> = {
                            Estável: 'Normal',
                            Atenção: 'Atenção',
                            Crítico: 'Crítico',
                        };
                        return {
                            codigo,
                            ocupante: pacienteNoLeito.nome,
                            status:
                                statusMap[pacienteNoLeito.statusClinico ?? 'Estável'] ??
                                'Normal',
                        };
                    }

                    const base = OCUPACAO_BASE[codigo];
                    return {
                        codigo,
                        ocupante: base?.ocupante ?? 'Vago',
                        status: base?.status ?? 'Livre',
                    };
                }
            );

            setCardsLeitos(gridLeitos);

            const alertasGerados: AlertaRecente[] = [];

            gridLeitos.forEach((item) => {
                if (item.status === 'Crítico') {
                    alertasGerados.push({
                        id: `crit-${item.codigo}`,
                        titulo: `Leito ${item.codigo} • ${item.ocupante}`,
                        descricao: 'Temperatura elevada',
                        tempo: 'Agora',
                        severidade: 'critico',
                    });
                } else if (item.status === 'Atenção') {
                    alertasGerados.push({
                        id: `aten-${item.codigo}`,
                        titulo: `Leito ${item.codigo} • ${item.ocupante}`,
                        descricao: 'Frequência cardíaca alterada',
                        tempo: '2 min atrás',
                        severidade: 'atencao',
                    });
                }
            });

            alertasGerados.push({
                id: 'disp-c02',
                titulo: 'Dispositivo C02',
                descricao: 'Bateria baixa',
                tempo: '10 min atrás',
                severidade: 'info',
            });

            setAlertas(alertasGerados.slice(0, 4));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDadosDashboard();
        const interval = setInterval(carregarDadosDashboard, 10000);
        return () => clearInterval(interval);
    }, []);

    const totalPacientes = pacientes.length;
    const totalLeitos =
        leitosApi.length > 0 ? leitosApi.length : cardsLeitos.length;
    const leitosOcupados = cardsLeitos.filter((l) => l.status !== 'Livre').length;
    const emObservacao = cardsLeitos.filter((l) => l.status === 'Atenção').length;
    const alertasCriticos = alertas.filter(
        (a) => a.severidade === 'critico'
    ).length;

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-slate-500">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-[#0E9F9E]" />
                Carregando dados do monitoramento...
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* Cabeçalho */}
            <div className="border-b border-slate-200/80 pb-4">
                <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
                    Dashboard
                </h1>
                <p className="mt-0.5 text-sm text-slate-500">
                    Visão geral do monitoramento hospitalar
                </p>
            </div>

            {/* 4 Cards de KPI ocupando 100% da largura da tela */}
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {/* Card 1: Pacientes */}
                <div className="rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0E9F9E] text-white">
                            <Users className="h-8 w-8" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-500">Pacientes</p>
                            <p className="text-4xl leading-tight font-extrabold text-slate-900">
                                {totalPacientes}
                            </p>
                            <p className="text-xs text-slate-400">Total de pacientes</p>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                        <span className="font-semibold text-emerald-600">↑ 5%</span> em
                        relação a ontem
                    </div>
                </div>

                {/* Card 2: Leitos ocupados */}
                <div className="rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#367591] text-white">
                            <BedDouble className="h-8 w-8" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-500">
                                Leitos ocupados
                            </p>
                            <p className="text-4xl leading-tight font-extrabold text-slate-900">
                                {leitosOcupados}
                            </p>
                            <p className="text-xs text-slate-400">de {totalLeitos} leitos</p>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                        <span className="font-semibold text-emerald-600">↑ 3%</span> em
                        relação a ontem
                    </div>
                </div>

                {/* Card 3: Em observação */}
                <div className="rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E5A50A] text-white">
                            <Eye className="h-8 w-8" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-500">
                                Em observação
                            </p>
                            <p className="text-4xl leading-tight font-extrabold text-slate-900">
                                {emObservacao}
                            </p>
                            <p className="text-xs text-slate-400">pacientes</p>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                        <span className="font-semibold text-slate-600">— 0%</span> em
                        relação a ontem
                    </div>
                </div>

                {/* Card 4: Alertas críticos */}
                <div className="rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#DC2626] text-white">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-500">
                                Alertas críticos
                            </p>
                            <p className="text-4xl leading-tight font-extrabold text-slate-900">
                                {alertasCriticos}
                            </p>
                            <p className="text-xs text-slate-400">necessitam atenção</p>
                        </div>
                    </div>
                    <div className="mt-4 text-xs">
            <span className="font-semibold text-[#DC2626]">
              ↑ {alertasCriticos} novos alertas
            </span>
                    </div>
                </div>
            </div>

            {/* Status dos Leitos + Alertas Recentes */}
            <div className="grid w-full grid-cols-1 items-start gap-5 lg:grid-cols-3">
                {/* Status dos leitos */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900">
                            Status dos leitos
                        </h2>
                        <Link
                            to="/leitos"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E9F9E] hover:underline"
                        >
                            Ver todos os leitos
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {cardsLeitos.map((leito) => {
                            const isCritico = leito.status === 'Crítico';
                            return (
                                <div
                                    key={leito.codigo}
                                    className={`rounded-xl border p-4 transition-all hover:shadow-xs ${
                                        isCritico
                                            ? 'border-red-200 bg-red-50/80'
                                            : 'border-slate-100 bg-white'
                                    }`}
                                >
                                    <p className="text-base font-bold text-slate-900">
                                        {leito.codigo}
                                    </p>
                                    <p className="mt-1 truncate text-sm text-slate-500">
                                        {leito.ocupante}
                                    </p>
                                    <span
                                        className={`mt-3 inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                                            badgeLeitoStyles[leito.status]
                                        }`}
                                    >
                    {leito.status}
                  </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Alertas Recentes */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900">
                            Alertas recentes
                        </h2>
                        <Link
                            to="/alertas"
                            className="text-xs font-semibold text-[#0E9F9E] hover:underline"
                        >
                            Ver todos
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {alertas.map((alerta) => (
                            <div
                                key={alerta.id}
                                className="flex items-start justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                            >
                                <div className="flex items-start gap-3">
                                    {alerta.severidade === 'critico' && (
                                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DC2626] text-white">
                                            <AlertCircle className="h-5 w-5" />
                                        </div>
                                    )}
                                    {alerta.severidade === 'atencao' && (
                                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5A50A] text-white">
                                            <AlertTriangle className="h-5 w-5" />
                                        </div>
                                    )}
                                    {alerta.severidade === 'info' && (
                                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
                                            <Info className="h-5 w-5" />
                                        </div>
                                    )}

                                    <div>
                                        <p
                                            className={`text-sm font-bold ${
                                                tituloAlertaStyles[alerta.severidade]
                                            }`}
                                        >
                                            {alerta.titulo}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {alerta.descricao}
                                        </p>
                                    </div>
                                </div>

                                <span className="shrink-0 text-xs text-slate-400">
                  {alerta.tempo}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}