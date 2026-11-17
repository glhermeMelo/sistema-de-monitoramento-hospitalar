import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    User,
    Thermometer,
    Activity,
    Droplet,
    AlertTriangle,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { pacienteService } from '../services/pacienteService';
import {
    leituraService,
    type LeituraPacienteResponse,
} from '../services/leituraService';
import type { PacienteResponse } from '../types/paciente';

type MetricaGrafico = 'temperaturaCorporal' | 'bpm' | 'spo2';

function calcularIdade(dataNascimento: string): number {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const nasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
    }
    return idade;
}

export function PacienteDetalhes() {
    const { id } = useParams<{ id: string }>();
    const [paciente, setPaciente] = useState<PacienteResponse | null>(null);
    const [leituras, setLeituras] = useState<LeituraPacienteResponse[]>([]);
    const [metrica, setMetrica] = useState<MetricaGrafico>('temperaturaCorporal');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregar() {
            if (!id) return;
            try {
                const [dadosPaciente, listaLeituras] = await Promise.all([
                    pacienteService.detalhar(Number(id)),
                    leituraService.listarPorPaciente(Number(id)).catch(() => []),
                ]);
                setPaciente(dadosPaciente);
                setLeituras(listaLeituras);
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    const ultimaLeitura = leituras[leituras.length - 1];

    const isCritico =
        (ultimaLeitura?.temperaturaCorporal ?? 36.5) >= 38.5 ||
        (ultimaLeitura?.spo2 ?? 98) < 90 ||
        (ultimaLeitura?.bpm ?? 75) > 120;

    const pontosGrafico = useMemo(() => {
        const ultimas = leituras.slice(-10);
        return ultimas.map((l) => ({
            hora: new Date(l.dataLeitura).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            valor: Number(l[metrica] ?? 0),
        }));
    }, [leituras, metrica]);

    const configMetrica: Record<
        MetricaGrafico,
        { label: string; unidade: string; min: number; max: number }
    > = {
        temperaturaCorporal: {
            label: 'Temperatura (°C)',
            unidade: '°C',
            min: 35,
            max: 41,
        },
        bpm: {
            label: 'Frequência Cardíaca (bpm)',
            unidade: ' bpm',
            min: 40,
            max: 150,
        },
        spo2: {
            label: 'Saturação O₂ (%)',
            unidade: '%',
            min: 85,
            max: 100,
        },
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#0E9F9E]" />
                Carregando prontuário do paciente...
            </div>
        );
    }

    if (!paciente) {
        return (
            <div className="rounded-2xl bg-white p-8 text-center shadow-xs">
                <p className="text-slate-600">Paciente não encontrado.</p>
                <Link
                    to="/pacientes"
                    className="mt-3 inline-block text-sm font-semibold text-[#0E9F9E] hover:underline"
                >
                    Voltar para Pacientes
                </Link>
            </div>
        );
    }

    const { min, max, unidade } = configMetrica[metrica];
    const width = 760;
    const height = 220;

    const svgPoints = pontosGrafico.map((p, idx) => {
        const x =
            pontosGrafico.length > 1
                ? 40 + (idx / (pontosGrafico.length - 1)) * (width - 80)
                : width / 2;
        const clamped = Math.min(max, Math.max(min, p.valor));
        const y = height - 30 - ((clamped - min) / (max - min)) * (height - 55);
        return { ...p, x, y };
    });

    const polylinePoints = svgPoints.map((p) => `${p.x},${p.y}`).join(' ');

    return (
        <div className="space-y-6">
            {/* Cabeçalho + Breadcrumb */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
                <nav className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                    <Link to="/pacientes" className="text-slate-400 hover:text-slate-600">
                        Pacientes
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-semibold text-[#0E9F9E]">{paciente.nome}</span>
                </nav>
            </div>

            {/* Card Principal do Paciente */}
            <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${
                        isCritico ? 'bg-red-50 text-red-500' : 'bg-[#0E9F9E]/10 text-[#0E9F9E]'
                    }`}
                >
                    <User className="h-7 w-7" />
                </div>

                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900">{paciente.nome}</h2>
                        <span
                            className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                                isCritico
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-emerald-50 text-emerald-600'
                            }`}
                        >
              {isCritico ? 'Estado Crítico' : 'Estado Estável'}
            </span>
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>
              Idade:{' '}
                <strong className="text-slate-800">
                {calcularIdade(paciente.dataNascimento)} anos
              </strong>
            </span>
                        <span className="text-slate-300">|</span>
                        <span>
              Prontuário:{' '}
                            <strong className="text-slate-800">#{paciente.idPaciente}</strong>
            </span>
                    </div>
                </div>
            </div>

            {/* 4 Cards de Sinais Vitais */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                        <Thermometer className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Temperatura</p>
                        <p className="text-lg font-bold text-slate-900">
                            {ultimaLeitura?.temperaturaCorporal !== undefined
                                ? `${ultimaLeitura.temperaturaCorporal.toFixed(1)} °C`
                                : '-- °C'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Freq. cardíaca</p>
                        <p className="text-lg font-bold text-slate-900">
                            {ultimaLeitura?.bpm !== undefined
                                ? `${ultimaLeitura.bpm} bpm`
                                : '-- bpm'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                        <Droplet className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Saturação O₂</p>
                        <p className="text-lg font-bold text-slate-900">
                            {ultimaLeitura?.spo2 !== undefined
                                ? `${ultimaLeitura.spo2.toFixed(0)} %`
                                : '-- %'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Última leitura</p>
                        <p className="text-lg font-bold text-slate-900">
                            {ultimaLeitura?.dataLeitura
                                ? new Date(ultimaLeitura.dataLeitura).toLocaleTimeString(
                                    'pt-BR',
                                    { hour: '2-digit', minute: '2-digit' }
                                )
                                : 'Sem registros'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Gráfico de Histórico de Sinais Vitais */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">
                            Histórico de sinais vitais
                        </h3>
                        <p className="text-xs text-slate-400">
                            Evolução recente registrada pelos sensores do paciente
                        </p>
                    </div>

                    <select
                        value={metrica}
                        onChange={(e) => setMetrica(e.target.value as MetricaGrafico)}
                        className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 focus:border-[#0E9F9E] focus:outline-none"
                    >
                        <option value="temperaturaCorporal">Temperatura (°C)</option>
                        <option value="bpm">Frequência Cardíaca (bpm)</option>
                        <option value="spo2">Saturação O₂ (%)</option>
                    </select>
                </div>

                {svgPoints.length === 0 ? (
                    <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
                        Nenhuma leitura registrada para este paciente ainda.
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full">
                            {[0, 0.33, 0.66, 1].map((step, i) => {
                                const y = height - 30 - step * (height - 55);
                                const val = (min + step * (max - min)).toFixed(
                                    metrica === 'temperaturaCorporal' ? 1 : 0
                                );
                                return (
                                    <g key={i}>
                                        <line
                                            x1={40}
                                            y1={y}
                                            x2={width - 20}
                                            y2={y}
                                            stroke="#F1F5F9"
                                            strokeDasharray="4 4"
                                        />
                                        <text
                                            x={4}
                                            y={y + 4}
                                            fontSize="10"
                                            fill="#94A3B8"
                                        >
                                            {val}
                                            {unidade}
                                        </text>
                                    </g>
                                );
                            })}

                            {svgPoints.length > 1 && (
                                <polyline
                                    fill="none"
                                    stroke="#DC2626"
                                    strokeWidth="2.5"
                                    points={polylinePoints}
                                />
                            )}

                            {svgPoints.map((p, idx) => (
                                <g key={idx}>
                                    <circle cx={p.x} cy={p.y} r="4" fill="#DC2626" />
                                    <text
                                        x={p.x}
                                        y={height - 8}
                                        textAnchor="middle"
                                        fontSize="10"
                                        fill="#94A3B8"
                                    >
                                        {p.hora}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}