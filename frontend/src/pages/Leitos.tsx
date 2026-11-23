import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
    Search,
    Plus,
    SquarePen,
    Trash2,
    X,
    AlertTriangle,
    Loader2,
} from 'lucide-react';
import { leitoService } from '../services/leitoService';
import { pacienteService } from '../services/pacienteService';
import type { LeitoResponse, StatusLeito } from '../types/leito';
import type { PacienteResponse } from '../types/paciente';

const statusLabelMap: Record<StatusLeito, string> = {
    OCUPADO: 'Ocupado',
    LIVRE: 'Livre',
    MANUTENCAO: 'Manutenção',
};

const statusBadgeStyles: Record<StatusLeito, string> = {
    OCUPADO: 'bg-red-100 text-red-600',
    LIVRE: 'bg-cyan-50 text-cyan-600',
    MANUTENCAO: 'bg-amber-50 text-amber-600',
};

const statusDescricaoMap: Record<StatusLeito, string> = {
    OCUPADO: 'Paciente internado',
    LIVRE: 'Disponível',
    MANUTENCAO: 'Limpeza / Reparo',
};

export function Leitos() {
    const [leitos, setLeitos] = useState<LeitoResponse[]>([]);
    const [pacientes, setPacientes] = useState<PacienteResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [busca, setBusca] = useState('');
    const [filtroAla, setFiltroAla] = useState('TODAS');
    const [filtroStatus, setFiltroStatus] = useState('TODOS');

    // Modais
    const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
    const [leitoParaEditar, setLeitoParaEditar] = useState<LeitoResponse | null>(
        null
    );
    const [leitoParaExcluir, setLeitoParaExcluir] =
        useState<LeitoResponse | null>(null);

    // Estados de formulário
    const [numeroLeito, setNumeroLeito] = useState('');
    const [localizacao, setLocalizacao] = useState('');
    const [statusLeito, setStatusLeito] = useState<StatusLeito>('LIVRE');
    const [idPaciente, setIdPaciente] = useState<string>('');
    const [salvando, setSalvando] = useState(false);
    const [erroForm, setErroForm] = useState('');
    const [erroExclusao, setErroExclusao] = useState('');

    async function carregarDados() {
        setLoading(true);
        try {
            const [leitosRes, pacientesRes] = await Promise.allSettled([
                leitoService.listar(),
                pacienteService.listar(),
            ]);

            if (leitosRes.status === 'fulfilled') {
                setLeitos(leitosRes.value);
            }
            if (pacientesRes.status === 'fulfilled') {
                setPacientes(pacientesRes.value);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    // Lista única de alas/setores existentes
    const alasDisponiveis = useMemo(() => {
        const setAlas = new Set(leitos.map((l) => l.localizacao).filter(Boolean));
        return Array.from(setAlas).sort();
    }, [leitos]);

    // Filtragem
    const leitosFiltrados = useMemo(() => {
        return leitos.filter((leito) => {
            const termo = busca.toLowerCase().trim();
            const matchBusca =
                !termo ||
                String(leito.numeroLeito).includes(termo) ||
                `leito ${leito.numeroLeito}`.includes(termo) ||
                leito.localizacao.toLowerCase().includes(termo);

            const matchAla =
                filtroAla === 'TODAS' || leito.localizacao === filtroAla;

            const matchStatus =
                filtroStatus === 'TODOS' || leito.statusLeito === filtroStatus;

            return matchBusca && matchAla && matchStatus;
        });
    }, [leitos, busca, filtroAla, filtroStatus]);

    // Agrupamento por Ala / Localização (igual ao Figma)
    const leitosAgrupadosPorAla = useMemo(() => {
        const grupos: Record<string, LeitoResponse[]> = {};
        for (const leito of leitosFiltrados) {
            const chave = leito.localizacao || 'Sem setor definido';
            if (!grupos[chave]) grupos[chave] = [];
            grupos[chave].push(leito);
        }
        Object.values(grupos).forEach((lista) =>
            lista.sort((a, b) => a.numeroLeito - b.numeroLeito)
        );
        return Object.entries(grupos).sort(([a], [b]) => a.localeCompare(b));
    }, [leitosFiltrados]);

    function abrirModalAdicionar() {
        setNumeroLeito('');
        setLocalizacao('');
        setStatusLeito('LIVRE');
        setIdPaciente('');
        setErroForm('');
        setModalAdicionarAberto(true);
    }

    function abrirModalEditar(leito: LeitoResponse) {
        setLeitoParaEditar(leito);
        setLocalizacao(leito.localizacao);
        setStatusLeito(leito.statusLeito);
        setIdPaciente(leito.idPaciente ? String(leito.idPaciente) : '');
        setErroForm('');
    }

    function extrairMensagemErro(err: any, fallback: string): string {
        if (err.response?.status === 403) {
            return 'Acesso negado: apenas usuários com perfil MANUTENÇÃO podem gerenciar leitos.';
        }
        const campos = err.response?.data?.campos;
        if (Array.isArray(campos) && campos.length > 0) {
            return campos.map((c: any) => c.mensagem).join(' • ');
        }
        return err.response?.data?.message || fallback;
    }

    async function handleAdicionarLeito(e: FormEvent) {
        e.preventDefault();
        setErroForm('');
        setSalvando(true);

        try {
            const pacienteIdNum = idPaciente ? Number(idPaciente) : null;
            await leitoService.cadastrar({
                numeroLeito: Number(numeroLeito),
                localizacao: localizacao.trim(),
                statusLeito: pacienteIdNum ? 'OCUPADO' : statusLeito,
                idPaciente: pacienteIdNum,
            });
            setModalAdicionarAberto(false);
            await carregarDados();
        } catch (err: any) {
            setErroForm(
                extrairMensagemErro(err, 'Erro ao cadastrar leito. Verifique os dados.')
            );
        } finally {
            setSalvando(false);
        }
    }

    async function handleEditarLeito(e: FormEvent) {
        e.preventDefault();
        if (!leitoParaEditar) return;
        setErroForm('');
        setSalvando(true);

        try {
            const pacienteIdNum = idPaciente ? Number(idPaciente) : null;
            await leitoService.atualizarTotal(leitoParaEditar.numeroLeito, {
                numeroLeito: leitoParaEditar.numeroLeito,
                localizacao: localizacao.trim(),
                statusLeito: pacienteIdNum ? 'OCUPADO' : statusLeito,
                idPaciente: pacienteIdNum,
            });
            setLeitoParaEditar(null);
            await carregarDados();
        } catch (err: any) {
            setErroForm(
                extrairMensagemErro(err, 'Erro ao atualizar leito. Verifique os dados.')
            );
        } finally {
            setSalvando(false);
        }
    }

    async function handleExcluirLeito() {
        if (!leitoParaExcluir) return;
        setErroExclusao('');
        setSalvando(true);

        try {
            await leitoService.remover(leitoParaExcluir.numeroLeito);
            setLeitoParaExcluir(null);
            await carregarDados();
        } catch (err: any) {
            setErroExclusao(
                extrairMensagemErro(
                    err,
                    'Não foi possível excluir o leito. Verifique se ele está ocupado ou possui sensores.'
                )
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Leitos</h1>
            </div>

            {/* Barra de Filtros, Botão e Legenda */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative w-60">
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar leito..."
                                className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#0E9F9E] focus:outline-none"
                            />
                        </div>

                        <select
                            value={filtroAla}
                            onChange={(e) => setFiltroAla(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-[#0E9F9E] focus:outline-none"
                        >
                            <option value="TODAS">Filtrar por Ala</option>
                            {alasDisponiveis.map((ala) => (
                                <option key={ala} value={ala}>
                                    {ala}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                            className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-[#0E9F9E] focus:outline-none"
                        >
                            <option value="TODOS">Todos os status</option>
                            <option value="OCUPADO">Ocupado</option>
                            <option value="LIVRE">Livre</option>
                            <option value="MANUTENCAO">Manutenção</option>
                        </select>
                    </div>

                    <div className="flex flex-col items-end gap-2.5">
                        <button
                            onClick={abrirModalAdicionar}
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0E9F9E] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0B8281]"
                        >
                            <Plus className="h-4 w-4" />
                            Adicionar leito
                        </button>

                        {/* Legenda visual */}
                        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Estável
              </span>
                            <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Atenção / Manutenção
              </span>
                            <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Ocupado / Crítico
              </span>
                            <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                Livre
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listagem Agrupada por Ala / Localização */}
            {loading ? (
                <div className="flex h-64 items-center justify-center text-slate-500">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#0E9F9E]" />
                    Carregando leitos...
                </div>
            ) : leitosAgrupadosPorAla.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                    <p className="text-sm font-medium text-slate-600">
                        Nenhum leito encontrado.
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Clique em “Adicionar leito” para cadastrar o primeiro leito.
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {leitosAgrupadosPorAla.map(([ala, listaLeitos]) => (
                        <section key={ala} className="space-y-3.5">
                            <h2 className="text-sm font-bold text-slate-800">{ala}</h2>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {listaLeitos.map((leito) => (
                                    <div
                                        key={leito.numeroLeito}
                                        className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all hover:shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                      <span className="text-base font-bold text-[#071422]">
                        Leito {String(leito.numeroLeito).padStart(2, '0')}
                      </span>

                                            <span
                                                className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold ${
                                                    statusBadgeStyles[leito.statusLeito]
                                                }`}
                                            >
                        {statusLabelMap[leito.statusLeito]}
                      </span>
                                        </div>

                                        <div className="mt-5 flex items-end justify-between gap-2">
                                            <div>
                                                <p className="text-[11px] text-slate-400">Situação</p>
                                                <p className="mt-0.5 text-xs font-bold text-slate-800">
                                                    {leito.nomePaciente ||
                                                        statusDescricaoMap[leito.statusLeito]}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    onClick={() => abrirModalEditar(leito)}
                                                    title="Editar leito"
                                                    className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-100"
                                                >
                                                    <SquarePen className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setErroExclusao('');
                                                        setLeitoParaExcluir(leito);
                                                    }}
                                                    title="Excluir leito"
                                                    className="cursor-pointer rounded-lg bg-red-50 p-1.5 text-red-600 transition-colors hover:bg-red-100"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            )}

            {/* Modal: Adicionar Leito */}
            {modalAdicionarAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">
                                Adicionar leito
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

                        <form onSubmit={handleAdicionarLeito} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Número do leito
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        required
                                        value={numeroLeito}
                                        onChange={(e) => setNumeroLeito(e.target.value)}
                                        placeholder="Ex: 101"
                                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-600">
                                        Status inicial
                                    </label>
                                    <select
                                        value={idPaciente ? 'OCUPADO' : statusLeito}
                                        disabled={Boolean(idPaciente)}
                                        onChange={(e) =>
                                            setStatusLeito(e.target.value as StatusLeito)
                                        }
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none disabled:bg-slate-50"
                                    >
                                        <option value="LIVRE">Livre</option>
                                        <option value="OCUPADO">Ocupado</option>
                                        <option value="MANUTENCAO">Manutenção</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Ala / Localização
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={100}
                                    value={localizacao}
                                    onChange={(e) => setLocalizacao(e.target.value)}
                                    placeholder="Ex: Ala A — Enfermaria"
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Paciente alocado (opcional)
                                </label>
                                <select
                                    value={idPaciente}
                                    onChange={(e) => setIdPaciente(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                >
                                    <option value="">Nenhum paciente (leito desocupado)</option>
                                    {pacientes.map((p) => (
                                        <option key={p.idPaciente} value={p.idPaciente}>
                                            #{p.idPaciente} — {p.nome}
                                        </option>
                                    ))}
                                </select>
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
                                    {salvando ? 'Salvando...' : 'Salvar leito'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Editar Leito */}
            {leitoParaEditar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">
                                Editar Leito {String(leitoParaEditar.numeroLeito).padStart(2, '0')}
                            </h2>
                            <button
                                onClick={() => setLeitoParaEditar(null)}
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

                        <form onSubmit={handleEditarLeito} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Ala / Localização
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={100}
                                    value={localizacao}
                                    onChange={(e) => setLocalizacao(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Paciente alocado
                                </label>
                                <select
                                    value={idPaciente}
                                    onChange={(e) => {
                                        setIdPaciente(e.target.value);
                                        if (!e.target.value && statusLeito === 'OCUPADO') {
                                            setStatusLeito('LIVRE');
                                        }
                                    }}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                >
                                    <option value="">Nenhum paciente (desocupar leito)</option>
                                    {pacientes.map((p) => (
                                        <option key={p.idPaciente} value={p.idPaciente}>
                                            #{p.idPaciente} — {p.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-600">
                                    Status do leito
                                </label>
                                <select
                                    value={idPaciente ? 'OCUPADO' : statusLeito}
                                    disabled={Boolean(idPaciente)}
                                    onChange={(e) => setStatusLeito(e.target.value as StatusLeito)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none disabled:bg-slate-50"
                                >
                                    <option value="LIVRE">Livre</option>
                                    <option value="OCUPADO">Ocupado</option>
                                    <option value="MANUTENCAO">Manutenção</option>
                                </select>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setLeitoParaEditar(null)}
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

            {/* Modal: Excluir Leito */}
            {leitoParaExcluir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <Trash2 className="h-5 w-5" />
                        </div>

                        <h2 className="text-lg font-bold text-slate-900">Excluir leito</h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Tem certeza que deseja excluir o{' '}
                            <strong className="text-slate-900">
                                Leito {String(leitoParaExcluir.numeroLeito).padStart(2, '0')}
                            </strong>{' '}
                            ({leitoParaExcluir.localizacao})?
                        </p>

                        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-left text-xs text-red-700">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                Esta ação não pode ser desfeita. Certifique-se de que o leito
                está livre e sem sensores vinculados antes de removê-lo.
              </span>
                        </div>

                        {erroExclusao && (
                            <div className="mt-3 rounded-lg border border-red-300 bg-red-100 px-3 py-2 text-xs font-medium text-red-800">
                                {erroExclusao}
                            </div>
                        )}

                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                onClick={() => setLeitoParaExcluir(null)}
                                className="cursor-pointer rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleExcluirLeito}
                                disabled={salvando}
                                className="cursor-pointer rounded-lg bg-[#DC2626] px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {salvando ? 'Excluindo...' : 'Excluir leito'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}