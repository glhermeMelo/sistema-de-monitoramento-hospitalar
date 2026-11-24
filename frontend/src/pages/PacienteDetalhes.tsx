import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    User,
    Thermometer,
    Activity,
    Droplet,
    Clock,
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
type StatusClinicoPaciente = 'Estável' | 'Atenção' | 'Crítico';

interface PacienteDetalhado extends PacienteResponse {
    setorLeito?: string;
    numeroLeito?: string;
    statusClinico?: StatusClinicoPaciente;
    statusManual?: StatusClinicoPaciente;
    observacoes?: string;
}

const STORAGE_SEED_KEY = 'smh_pacientes_seed_v1';
const STORAGE_EXTRAS_KEY = 'smh_pacientes_extras_v1';

function calcularIdade(dataNascimento: string): number {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const iso = dataNascimento.includes('/')
        ? dataNascimento.split('/').reverse().join('-')
        : dataNascimento;
    const nasc = new Date(iso);
    if (Number.isNaN(nasc.getTime())) return 0;

    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
    }
    return idade;
}

function buscarPacienteLocal(idPaciente: number): PacienteDetalhado | null {
    try {
        const rawSeeds = localStorage.getItem(STORAGE_SEED_KEY);
        if (rawSeeds) {
            const lista: PacienteDetalhado[] = JSON.parse(rawSeeds);
            const encontrado = lista.find((p) => p.idPaciente === idPaciente);
            if (encontrado) return encontrado;
        }

        const rawExtras = localStorage.getItem(STORAGE_EXTRAS_KEY);
        if (rawExtras) {
            const extrasMap = JSON.parse(rawExtras);
            if (extrasMap[idPaciente]) {
                const extra = extrasMap[idPaciente];
                return {
                    idPaciente,
                    nome: extra.nomeEditado || `Paciente #${idPaciente}`,
                    cpf: extra.cpf || '',
                    dataNascimento: extra.dataNascimentoEditada || '1990-01-01',
                    ...extra,
                };
            }
        }
    } catch {
        return null;
    }
    return null;
}

function gerarLeiturasMock(
    idPaciente: number,
    status: StatusClinicoPaciente = 'Estável'
): LeituraPacienteResponse[] {
    const agora = Date.now();
    const variacaoSeed = (idPaciente % 5) * 0.1;

    const perfis: Record<
        StatusClinicoPaciente,
        { temps: number[]; bpms: number[]; spo2s: number[] }
    > = {
        Crítico: {
            temps: [37.4, 37.6, 37.9, 38.1, 38.3, 38.5, 38.6, 38.8, 38.9, 39.1],
            bpms: [96, 102, 108, 112, 118, 122, 125, 128, 130, 132],
            spo2s: [95, 94, 93, 92, 91, 90, 89, 89, 88, 88],
        },
        Atenção: {
            temps: [36.8, 37.0, 37.1, 37.3, 37.4, 37.6, 37.7, 37.8, 37.7, 37.9],
            bpms: [84, 88, 92, 95, 98, 101, 104, 106, 105, 108],
            spo2s: [97, 96, 96, 95, 95, 94, 94, 93, 94, 93],
        },
        Estável: {
            temps: [36.4, 36.5, 36.5, 36.6, 36.7, 36.6, 36.5, 36.6, 36.7, 36.6],
            bpms: [72, 74, 76, 75, 78, 77, 74, 75, 76, 75],
            spo2s: [98, 98, 99, 98, 98, 99, 98, 98, 99, 98],
        },
    };

    const perfil = perfis[status] ?? perfis.Estável;

    return perfil.temps.map((temp, idx) => {
        const timestamp = new Date(agora - (9 - idx) * 15 * 60 * 1000).toISOString();
        return {
            idLeitura: idx + 1,
            idPaciente,
            temperaturaCorporal: Number((temp + variacaoSeed).toFixed(1)),
            bpm: perfil.bpms[idx] + (idPaciente % 4),
            spo2: Math.min(100, perfil.spo2s[idx]),
            dataLeitura: timestamp,
        } as LeituraPacienteResponse;
    });
}

export function PacienteDetalhes() {
    const { id } = useParams<{ id: string }>();
    const [paciente, setPaciente] = useState<PacienteDetalhado | null>(null);
    const [leituras, setLeituras] = useState<LeituraPacienteResponse[]>([]);
    const [metrica, setMetrica] = useState<MetricaGrafico>('temperaturaCorporal');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregar() {
            if (!id) return;
            const numericId = Number(id);
            setLoading(true);

            try {
                const [dadosApi, leiturasApi] = await Promise.all([
                    pacienteService.detalhar(numericId).catch(() => null),
                    leituraService.listarPorPaciente(numericId).catch(() => []),
                ]);

                const dadosLocal = buscarPacienteLocal(numericId);
                const pacienteFinal: PacienteDetalhado | null = dadosApi
                    ? { ...dadosApi, ...dadosLocal }
                    : dadosLocal;

                setPaciente(pacienteFinal);

                if (leiturasApi.length > 0) {
                    setLeituras(leiturasApi);
                } else if (pacienteFinal) {
                    const status =
                        pacienteFinal.statusClinico ||
                        pacienteFinal.statusManual ||
                        'Estável';
                    setLeituras(gerarLeiturasMock(numericId, status));
                }
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    const ultimaLeitura = leituras[leituras.length - 1];

    const statusAtual: StatusClinicoPaciente = useMemo(() => {
        if (paciente?.statusClinico) return paciente.statusClinico;
        if (paciente?.statusManual) return paciente.statusManual;

        if (
            (ultimaLeitura?.temperaturaCorporal ?? 36.5) >= 38.5 ||
            (ultimaLeitura?.spo2 ?? 98) < 90 ||
            (ultimaLeitura?.bpm ?? 75) > 120
        ) {
            return 'Crítico';
        }
        if (
            (ultimaLeitura?.temperaturaCorporal ?? 36.5) >= 37.6 ||
            (ultimaLeitura?.spo2 ?? 98) < 95 ||
            (ultimaLeitura?.bpm ?? 75) > 100
        ) {
            return 'Atenção';
        }
        return 'Estável';
    }, [paciente, ultimaLeitura]);

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
        { label: string; unidade: string; min: number; max: number; cor: string }
    > = {
        temperaturaCorporal: {
            label: 'Temperatura (°C)',
            unidade: '°C',
            min: 35,
            max: 41,
            cor: '#DC2626',
        },
        bpm: {
            label: 'Frequência Cardíaca (bpm)',
            unidade: ' bpm',
            min: 40,
            max: 150,
            cor: '#0E9F9E',
        },
        spo2: {
            label: 'Saturação O₂ (%)',
            unidade: '%',
            min: 85,
            max: 100,
            cor: '#2563EB',
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

    const { min, max, unidade, cor } = configMetrica[metrica];
    const width = 760;
    const height = 220;

    const svgPoints = pontosGrafico.map((p, idx) => {
        const x =
            pontosGrafico.length > 1
                ? 45 + (idx / (pontosGrafico.length - 1)) * (width - 80)
                : width / 2;
        const clamped = Math.min(max, Math.max(min, p.valor));
        const y = height - 30 - ((clamped - min) / (max - min)) * (height - 55);
        return { ...p, x, y };
    });

    const polylinePoints = svgPoints.map((p) => `${p.x},${p.y}`).join(' ');

    const badgeStatusStyles: Record<StatusClinicoPaciente, string> = {
        Crítico: 'bg-red-100 text-red-600',
        Atenção: 'bg-amber-50 text-amber-600',
        Estável: 'bg-emerald-50 text-emerald-600',
    };

    const avatarStatusStyles: Record<StatusClinicoPaciente, string> = {
        Crítico: 'bg-red-50 text-red-500',
        Atenção: 'bg-amber-50 text-amber-500',
        Estável: 'bg-[#0E9F9E]/10 text-[#0E9F9E]',
    };

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
            <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                <div className="flex flex-wrap items-center gap-5">
                    <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${avatarStatusStyles[statusAtual]}`}
                    >
                        <User className="h-7 w-7" />
                    </div>

                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900">
                                {paciente.nome}
                            </h2>
                            <span
                                className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${badgeStatusStyles[statusAtual]}`}
                            >
                Estado {statusAtual}
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
                                <strong className="text-slate-800">
                  #{paciente.idPaciente}
                </strong>
              </span>
                            {paciente.setorLeito && (
                                <>
                                    <span className="text-slate-300">|</span>
                                    <span>
                    Setor:{' '}
                                        <strong className="text-slate-800">
                      {paciente.setorLeito}
                    </strong>
                  </span>
                                </>
                            )}
                            {paciente.numeroLeito && (
                                <>
                                    <span className="text-slate-300">|</span>
                                    <span>
                    Leito:{' '}
                                        <strong className="text-[#143B59]">
                      {paciente.numeroLeito}
                    </strong>
                  </span>
                                </>
                            )}
                        </div>

                        {paciente.observacoes && (
                            <p className="mt-2 text-xs text-slate-500">
                                <strong className="text-slate-700">Observações:</strong>{' '}
                                {paciente.observacoes}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* 4 Cards de Sinais Vitais */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-xs">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                        <Thermometer className="h-6 w-6" />
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                        <Activity className="h-6 w-6" />
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                        <Droplet className="h-6 w-6" />
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
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <Clock className="h-6 w-6" />
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
                                        x1={45}
                                        y1={y}
                                        x2={width - 20}
                                        y2={y}
                                        stroke="#F1F5F9"
                                        strokeDasharray="4 4"
                                    />
                                    <text x={4} y={y + 4} fontSize="10" fill="#94A3B8">
                                        {val}
                                        {unidade}
                                    </text>
                                </g>
                            );
                        })}

                        {svgPoints.length > 1 && (
                            <polyline
                                fill="none"
                                stroke={cor}
                                strokeWidth="2.5"
                                points={polylinePoints}
                            />
                        )}

                        {svgPoints.map((p, idx) => (
                            <g key={idx}>
                                <circle cx={p.x} cy={p.y} r="4" fill={cor} />
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
            </div>
        </div>
    );
}