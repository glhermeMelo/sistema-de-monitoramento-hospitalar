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
import { pacienteService } from '../services/pacienteService';
import { leituraService } from '../services/leituraService';
import type { PacienteResponse } from '../types/paciente';

type StatusClinicoPaciente = 'Estável' | 'Atenção' | 'Crítico';

interface PacienteComStatus extends PacienteResponse {
    statusClinico: StatusClinicoPaciente;
}

const statusBadgeStyles: Record<StatusClinicoPaciente, string> = {
    Estável: 'bg-emerald-50 text-emerald-600',
    Atenção: 'bg-amber-50 text-amber-600',
    Crítico: 'bg-red-100 text-red-600',
};

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
    // Converte YYYY-MM-DD -> dd/MM/yyyy
    const [ano, mes, dia] = isoDate.split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarDataExibicao(isoDate: string): string {
    if (!isoDate) return '-';
    if (isoDate.includes('/')) return isoDate;
    const [ano, mes, dia] = isoDate.split('-');
    return `${dia}/${mes}/${ano}`;
}

export function Pacientes() {
    const [pacientes, setPacientes] = useState<PacienteComStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState('');
    const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 7;

    // Modais
    const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
    const [pacienteParaExcluir, setPacienteParaExcluir] =
        useState<PacienteComStatus | null>(null);
    const [pacienteDetalhesModal, setPacienteDetalhesModal] =
        useState<PacienteComStatus | null>(null);

    // Form Adicionar
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [erroForm, setErroForm] = useState('');
    const [erroExclusao, setErroExclusao] = useState('');

    async function carregarPacientes() {
        setLoading(true);
        try {
            const lista = await pacienteService.listar();

            const enriquecidos = await Promise.all(
                lista.map(async (p) => {
                    try {
                        const leituras = await leituraService.listarPorPaciente(p.idPaciente);
                        const ultima = leituras[leituras.length - 1];
                        return {
                            ...p,
                            statusClinico: calcularStatusClinico(
                                ultima?.temperaturaCorporal,
                                ultima?.bpm,
                                ultima?.spo2
                            ),
                        };
                    } catch {
                        return { ...p, statusClinico: 'Estável' as StatusClinicoPaciente };
                    }
                })
            );

            setPacientes(enriquecidos);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarPacientes();
    }, []);

    const pacientesFiltrados = useMemo(() => {
        return pacientes.filter((p) => {
            const matchNome = p.nome.toLowerCase().includes(busca.toLowerCase());
            const matchStatus =
                filtroStatus === 'TODOS' || p.statusClinico === filtroStatus;
            return matchNome && matchStatus;
        });
    }, [pacientes, busca, filtroStatus]);

    const totalPaginas = Math.max(
        1,
        Math.ceil(pacientesFiltrados.length / itensPorPagina)
    );
    const pacientesPaginados = pacientesFiltrados.slice(
        (paginaAtual - 1) * itensPorPagina,
        paginaAtual * itensPorPagina
    );

    async function handleAdicionarPaciente(e: FormEvent) {
        e.preventDefault();
        setErroForm('');
        setSalvando(true);

        try {
            await pacienteService.cadastrar({
                nome: nome.trim(),
                cpf: cpf.replace(/\D/g, ''),
                dataNascimento: formatarDataParaBackend(dataNascimento),
            });
            setNome('');
            setCpf('');
            setDataNascimento('');
            setModalAdicionarAberto(false);
            await carregarPacientes();
        } catch (err: any) {
            const campos = err.response?.data?.campos;
            if (Array.isArray(campos) && campos.length > 0) {
                setErroForm(campos.map((c: any) => c.mensagem).join(' • '));
            } else {
                setErroForm(
                    err.response?.data?.message ||
                    'Erro ao cadastrar paciente. Verifique os dados.'
                );
            }
        } finally {
            setSalvando(false);
        }
    }

    async function handleExcluirPaciente() {
        if (!pacienteParaExcluir) return;
        setErroExclusao('');
        setSalvando(true);

        try {
            await pacienteService.remover(pacienteParaExcluir.idPaciente);
            setPacienteParaExcluir(null);
            await carregarPacientes();
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
                    onClick={() => {
                        setErroForm('');
                        setModalAdicionarAberto(true);
                    }}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0E9F9E] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0B8281]"
                >
                    <Plus className="h-4 w-4" />
                    Novo paciente
                </button>
            </div>

            {/* Tabela de Pacientes */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                {loading ? (
                    <div className="flex h-64 items-center justify-center text-slate-500">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#0E9F9E]" />
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
                                <th className="px-6 py-3.5">Data de Nascimento</th>
                                <th className="px-6 py-3.5">ID</th>
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
                                            className="hover:text-[#0E9F9E] hover:underline"
                                        >
                                            {paciente.nome}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {formatarDataExibicao(paciente.dataNascimento)}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-[#071422]">
                                        #{paciente.idPaciente}
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
                                                onClick={() => setPacienteDetalhesModal(paciente)}
                                                title="Visualizar / Editar dados"
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

                {/* Rodapé de Paginação */}
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

            {/* Modal: Adicionar Paciente */}
            {modalAdicionarAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">
                                Adicionar paciente
                            </h2>
                            <button
                                onClick={() => setModalAdicionarAberto(false)}
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

                        <form onSubmit={handleAdicionarPaciente} className="space-y-4">
                            <p className="text-xs font-bold tracking-wide text-slate-700 uppercase">
                                Dados pessoais
                            </p>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Nome completo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Digite o nome completo (apenas letras)"
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={cpf}
                                        onChange={(e) => setCpf(e.target.value)}
                                        placeholder="000.000.000-00"
                                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Data de nascimento
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={dataNascimento}
                                        onChange={(e) => setDataNascimento(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalAdicionarAberto(false)}
                                    className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="cursor-pointer rounded-lg bg-[#071422] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0D1F33] disabled:opacity-60"
                                >
                                    {salvando ? 'Salvando...' : 'Salvar paciente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Dados do Paciente (Visualização Rápida) */}
            {pacienteDetalhesModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">
                                Ficha do paciente
                            </h2>
                            <button
                                onClick={() => setPacienteDetalhesModal(null)}
                                className="cursor-pointer rounded-full p-1 text-slate-400 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div>
                                <span className="block text-xs text-slate-400">Nome completo</span>
                                <span className="font-semibold text-slate-800">
                  {pacienteDetalhesModal.nome}
                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                  <span className="block text-xs text-slate-400">
                    Data de nascimento
                  </span>
                                    <span className="font-medium text-slate-700">
                    {formatarDataExibicao(pacienteDetalhesModal.dataNascimento)}
                  </span>
                                </div>
                                <div>
                  <span className="block text-xs text-slate-400">
                    Estado clínico
                  </span>
                                    <span
                                        className={`mt-0.5 inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                                            statusBadgeStyles[pacienteDetalhesModal.statusClinico]
                                        }`}
                                    >
                    {pacienteDetalhesModal.statusClinico}
                  </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                            <button
                                onClick={() => setPacienteDetalhesModal(null)}
                                className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Fechar
                            </button>
                            <Link
                                to={`/pacientes/${pacienteDetalhesModal.idPaciente}`}
                                className="rounded-lg bg-[#0E9F9E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B8281]"
                            >
                                Ver sinais vitais
                            </Link>
                        </div>
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