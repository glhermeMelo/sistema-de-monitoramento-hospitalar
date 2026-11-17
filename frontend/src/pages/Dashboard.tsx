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
import type { LeitoResponse, StatusLeito } from '../types/leito';
import type { PacienteResponse } from '../types/paciente';

type SeveridadeAlerta = 'critico' | 'atencao' | 'info';

interface AlertaRecente {
    id: string;
    titulo: string;
    descricao: string;
    tempo: string;
    severidade: SeveridadeAlerta;
}

const statusLabelMap: Record<StatusLeito, string> = {
    OCUPADO: 'Ocupado',
    LIVRE: 'Livre',
    MANUTENCAO: 'Manutenção',
};

const statusBadgeStyles: Record<StatusLeito, string> = {
    OCUPADO: 'bg-emerald-50 text-emerald-600',
    LIVRE: 'bg-slate-100 text-slate-500',
    MANUTENCAO: 'bg-amber-50 text-amber-600',
};

export function Dashboard() {
    const [leitos, setLeitos] = useState<LeitoResponse[]>([]);
    const [pacientes, setPacientes] = useState<PacienteResponse[]>([]);
    const [alertas, setAlertas] = useState<AlertaRecente[]>([]);
    const [loading, setLoading] = useState(true);
    const [erroPermissao, setErroPermissao] = useState('');

    async function carregarDadosDashboard() {
        try {
            setErroPermissao('');
            const [leitosRes, pacientesRes] = await Promise.allSettled([
                leitoService.listar(),
                pacienteService.listar(),
            ]);

            const listaLeitos =
                leitosRes.status === 'fulfilled' ? leitosRes.value : [];
            const listaPacientes =
                pacientesRes.status === 'fulfilled' ? pacientesRes.value : [];

            setLeitos(listaLeitos);
            setPacientes(listaPacientes);

            if (
                leitosRes.status === 'rejected' &&
                pacientesRes.status === 'rejected'
            ) {
                setErroPermissao(
                    'Seu perfil atual não possui permissão para visualizar leitos e pacientes.'
                );
            }

            // Gera alertas automáticos com base nos leitos em manutenção
            const alertasGerados: AlertaRecente[] = listaLeitos
                .filter((l) => l.statusLeito === 'MANUTENCAO')
                .map((l) => ({
                    id: `manut-${l.numeroLeito}`,
                    titulo: `Leito ${l.numeroLeito} • ${l.localizacao}`,
                    descricao: 'Leito em manutenção preventiva',
                    tempo: 'Ativo',
                    severidade: 'info',
                }));

            setAlertas(alertasGerados);
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
    const totalLeitos = leitos.length;
    const leitosOcupados = leitos.filter((l) => l.statusLeito === 'OCUPADO').length;
    const leitosManutencao = leitos.filter(
        (l) => l.statusLeito === 'MANUTENCAO'
    ).length;
    const alertasCriticos = alertas.filter((a) => a.severidade === 'critico').length;

    const taxaOcupacao =
        totalLeitos > 0 ? Math.round((leitosOcupados / totalLeitos) * 100) : 0;

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#0E9F9E]" />
                Carregando dados do monitoramento...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cabeçalho */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Visão geral do monitoramento hospitalar
                    </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          Atualização em tempo real
        </span>
            </div>

            {erroPermissao && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {erroPermissao}
                </div>
            )}

            {/* 4 Cards de KPI */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0E9F9E] text-white">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Pacientes</p>
                            <p className="text-2xl font-bold text-slate-900">{totalPacientes}</p>
                            <p className="text-xs text-slate-400">Total de pacientes</p>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                        Cadastrados no sistema
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#367591] text-white">
                            <BedDouble className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Leitos ocupados</p>
                            <p className="text-2xl font-bold text-slate-900">{leitosOcupados}</p>
                            <p className="text-xs text-slate-400">de {totalLeitos} leitos</p>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                        <span className="font-semibold text-emerald-600">{taxaOcupacao}%</span>{' '}
                        de taxa de ocupação
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E5A50A] text-white">
                            <Eye className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Em manutenção</p>
                            <p className="text-2xl font-bold text-slate-900">{leitosManutencao}</p>
                            <p className="text-xs text-slate-400">leitos indisponíveis</p>
                        </div>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                        Aguardando liberação técnica
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#DC2626] text-white">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500">Alertas críticos</p>
                            <p className="text-2xl font-bold text-slate-900">{alertasCriticos}</p>
                            <p className="text-xs text-slate-400">necessitam atenção</p>
                        </div>
                    </div>
                    <div className="mt-4 text-xs">
            <span className="font-semibold text-slate-500">
              Monitoramento contínuo
            </span>
                    </div>
                </div>
            </div>

            {/* Status dos Leitos + Alertas Recentes */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:col-span-2">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900">Status dos leitos</h2>
                        <Link
                            to="/leitos"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E9F9E] hover:underline"
                        >
                            Ver todos os leitos
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {leitos.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
                            <p className="text-sm font-medium text-slate-600">
                                Nenhum leito cadastrado ainda.
                            </p>
                            <Link
                                to="/leitos"
                                className="mt-2 inline-block text-xs font-semibold text-[#0E9F9E] hover:underline"
                            >
                                Cadastrar primeiro leito →
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
                            {leitos.slice(0, 12).map((leito) => (
                                <div
                                    key={leito.numeroLeito}
                                    className="rounded-xl border border-slate-100 bg-white p-4 transition-all hover:shadow-sm"
                                >
                                    <p className="text-sm font-bold text-slate-900">
                                        Leito {leito.numeroLeito}
                                    </p>
                                    <p className="mt-0.5 truncate text-xs text-slate-500">
                                        {leito.localizacao}
                                    </p>
                                    <span
                                        className={`mt-3 inline-block rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                                            statusBadgeStyles[leito.statusLeito]
                                        }`}
                                    >
                    {statusLabelMap[leito.statusLeito]}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Alertas Recentes */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900">Alertas recentes</h2>
                        <Link
                            to="/alertas"
                            className="text-xs font-semibold text-[#0E9F9E] hover:underline"
                        >
                            Ver todos
                        </Link>
                    </div>

                    {alertas.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
                            <p className="text-sm font-medium text-slate-600">
                                Nenhum alerta ativo no momento.
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Todos os parâmetros dentro da normalidade.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {alertas.map((alerta) => (
                                <div
                                    key={alerta.id}
                                    className="flex items-start justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                                >
                                    <div className="flex items-start gap-3">
                                        {alerta.severidade === 'critico' && (
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#DC2626] text-white">
                                                <AlertCircle className="h-4 w-4" />
                                            </div>
                                        )}
                                        {alerta.severidade === 'atencao' && (
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E5A50A] text-white">
                                                <AlertTriangle className="h-4 w-4" />
                                            </div>
                                        )}
                                        {alerta.severidade === 'info' && (
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-white">
                                                <Info className="h-4 w-4" />
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-xs font-bold text-blue-600">
                                                {alerta.titulo}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {alerta.descricao}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="shrink-0 text-[11px] text-slate-400">
                    {alerta.tempo}
                  </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}