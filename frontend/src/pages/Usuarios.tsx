import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
    Search,
    Plus,
    SquarePen,
    Trash2,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    Stethoscope,
    HeartPulse,
    Wrench,
    Shield,
    Check,
    Loader2,
} from 'lucide-react';
import { usuarioService } from '../services/usuarioService';
import type { CargoUsuario, UsuarioResponse } from '../types/usuario';

type ModoTela = 'LISTAGEM' | 'NOVO' | 'EDITAR';

interface ConfigPerfil {
    cargo: CargoUsuario;
    titulo: string;
    descricao: string;
    badgeStyle: string;
    avatarStyle: string;
    iconBg: string;
    permissoes: string[];
}

const STORAGE_USUARIOS_KEY = 'smh_usuarios_mock_v1';

const USUARIOS_INICIAIS_MOCK: UsuarioResponse[] = [
    {
        nome: 'Dr. Carlos Mendes',
        login: 'carlos.mendes@hospital.com',
        cpf: '12345678901',
        cargo: 'ADMIN',
    },
    {
        nome: 'Dra. Helena Nogueira',
        login: 'helena.nogueira@hospital.com',
        cpf: '23456789012',
        cargo: 'MEDICO',
    },
    {
        nome: 'Dr. Rodrigo Vasconcelos',
        login: 'rodrigo.vasconcelos@hospital.com',
        cpf: '34567890123',
        cargo: 'MEDICO',
    },
    {
        nome: 'Enf. Mariana Almeida',
        login: 'mariana.almeida@hospital.com',
        cpf: '45678901234',
        cargo: 'ENFERMAGEM',
    },
    {
        nome: 'Enf. Lucas Ferreira',
        login: 'lucas.ferreira@hospital.com',
        cpf: '56789012345',
        cargo: 'ENFERMAGEM',
    },
    {
        nome: 'Téc. Roberto Nascimento',
        login: 'roberto.nascimento@hospital.com',
        cpf: '67890123456',
        cargo: 'MANUTENCAO',
    },
];

const PERFIS: ConfigPerfil[] = [
    {
        cargo: 'MEDICO',
        titulo: 'Médico',
        descricao:
            'Acesso completo aos dados dos pacientes, leitos e histórico de monitoramento.',
        badgeStyle: 'bg-emerald-50 text-emerald-600',
        avatarStyle: 'bg-sky-100 text-sky-700',
        iconBg: 'bg-emerald-50 text-emerald-600',
        permissoes: [
            'Visualizar pacientes e leitos',
            'Acessar histórico de monitoramento',
            'Cadastrar e dar alta a pacientes',
            'Acompanhar alertas clínicos',
        ],
    },
    {
        cargo: 'ENFERMAGEM',
        titulo: 'Enfermagem',
        descricao:
            'Acesso aos pacientes sob cuidados, monitoramento em tempo real e registros básicos.',
        badgeStyle: 'bg-amber-50 text-amber-600',
        avatarStyle: 'bg-amber-100 text-amber-700',
        iconBg: 'bg-amber-50 text-amber-600',
        permissoes: [
            'Visualizar pacientes e leitos',
            'Acessar histórico de monitoramento',
            'Cadastrar pacientes',
        ],
    },
    {
        cargo: 'MANUTENCAO',
        titulo: 'Manutenção',
        descricao:
            'Acesso aos dispositivos, sensores e ferramentas de manutenção de leitos.',
        badgeStyle: 'bg-blue-50 text-blue-600',
        avatarStyle: 'bg-indigo-100 text-indigo-700',
        iconBg: 'bg-blue-50 text-blue-600',
        permissoes: [
            'Cadastrar e gerenciar leitos',
            'Configurar sensores de pacientes e ambiente',
            'Colocar leitos em manutenção',
        ],
    },
    {
        cargo: 'ADMIN',
        titulo: 'Gerente',
        descricao:
            'Acesso total ao sistema, gestão de usuários, relatórios e configurações.',
        badgeStyle: 'bg-purple-50 text-purple-600',
        avatarStyle: 'bg-purple-100 text-purple-700',
        iconBg: 'bg-purple-50 text-purple-600',
        permissoes: [
            'Visualizar pacientes e leitos',
            'Acessar histórico de monitoramento',
            'Gerenciar alertas',
            'Gerar relatórios',
            'Gerenciar usuários',
        ],
    },
];

function getConfigPerfil(cargo?: CargoUsuario): ConfigPerfil {
    return PERFIS.find((p) => p.cargo === cargo) ?? PERFIS[0];
}

function getIniciais(nome: string): string {
    const partes = nome.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function dataUmAnoFrente(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
}

function lerUsuariosLocais(): UsuarioResponse[] {
    try {
        const raw = localStorage.getItem(STORAGE_USUARIOS_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch {
        // fallback para seed inicial
    }
    localStorage.setItem(
        STORAGE_USUARIOS_KEY,
        JSON.stringify(USUARIOS_INICIAIS_MOCK)
    );
    return USUARIOS_INICIAIS_MOCK;
}

function salvarUsuariosLocais(lista: UsuarioResponse[]) {
    try {
        localStorage.setItem(STORAGE_USUARIOS_KEY, JSON.stringify(lista));
    } catch {
        // ignora erro de quota
    }
}

export function Usuarios() {
    const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [modoTela, setModoTela] = useState<ModoTela>('LISTAGEM');

    // Filtros e paginação
    const [busca, setBusca] = useState('');
    const [filtroPerfil, setFiltroPerfil] = useState('TODOS');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 8;

    // Formulário Novo / Editar
    const [usuarioEditando, setUsuarioEditando] =
        useState<UsuarioResponse | null>(null);
    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [cargoSelecionado, setCargoSelecionado] =
        useState<CargoUsuario>('MEDICO');
    const [dataLimite, setDataLimite] = useState(dataUmAnoFrente());
    const [idAdmin, setIdAdmin] = useState('1');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    // Modal excluir & feedback
    const [usuarioParaExcluir, setUsuarioParaExcluir] =
        useState<UsuarioResponse | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');

    async function carregarUsuarios() {
        setLoading(true);
        try {
            const listaApi = await usuarioService.listar();
            if (Array.isArray(listaApi) && listaApi.length > 0) {
                setUsuarios(listaApi);
                salvarUsuariosLocais(listaApi);
            } else {
                setUsuarios(lerUsuariosLocais());
            }
        } catch {
            setUsuarios(lerUsuariosLocais());
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter((u) => {
            const termo = busca.toLowerCase().trim();
            const matchBusca =
                !termo ||
                u.nome.toLowerCase().includes(termo) ||
                u.login.toLowerCase().includes(termo);
            const matchPerfil =
                filtroPerfil === 'TODOS' || u.cargo === filtroPerfil;
            return matchBusca && matchPerfil;
        });
    }, [usuarios, busca, filtroPerfil]);

    const totalPaginas = Math.max(
        1,
        Math.ceil(usuariosFiltrados.length / itensPorPagina)
    );
    const usuariosPaginados = usuariosFiltrados.slice(
        (paginaAtual - 1) * itensPorPagina,
        paginaAtual * itensPorPagina
    );

    function abrirNovoUsuario() {
        setErro('');
        setNome('');
        setLogin('');
        setCpf('');
        setSenha('');
        setConfirmarSenha('');
        setCargoSelecionado('MEDICO');
        setDataLimite(dataUmAnoFrente());
        setUsuarioEditando(null);
        setModoTela('NOVO');
    }

    function abrirEditarUsuario(usuario: UsuarioResponse) {
        setErro('');
        setUsuarioEditando(usuario);
        setNome(usuario.nome);
        setLogin(usuario.login);
        setCpf(usuario.cpf ?? '');
        setSenha('');
        setConfirmarSenha('');
        setCargoSelecionado(usuario.cargo ?? 'MEDICO');
        setModoTela('EDITAR');
    }

    async function handleSalvarNovoUsuario(e: FormEvent) {
        e.preventDefault();
        setErro('');

        if (senha !== confirmarSenha) {
            setErro('As senhas digitadas não coincidem.');
            return;
        }

        const cpfLimpo =
            cpf.replace(/\D/g, '') || String(Date.now()).slice(-11);

        if (usuarios.some((u) => u.login.toLowerCase() === login.trim().toLowerCase())) {
            setErro('Já existe um usuário cadastrado com este login/e-mail.');
            return;
        }

        setSalvando(true);

        try {
            await usuarioService
                .cadastrarAutorizacaoCpf({
                    cpf: cpfLimpo,
                    cargo: cargoSelecionado,
                    idAdmin: Number(idAdmin) || 1,
                    dataLimiteHabilitado: dataLimite,
                })
                .catch(() => {});

            await usuarioService
                .cadastrarUsuario({
                    nome: nome.trim(),
                    cpf: cpfLimpo,
                    login: login.trim(),
                    senha,
                })
                .catch(() => {});
        } finally {
            const novoUsuario: UsuarioResponse = {
                nome: nome.trim(),
                login: login.trim(),
                cpf: cpfLimpo,
                cargo: cargoSelecionado,
            };
            const atualizados = [novoUsuario, ...usuarios];
            setUsuarios(atualizados);
            salvarUsuariosLocais(atualizados);
            setModoTela('LISTAGEM');
            setSalvando(false);
        }
    }

    async function handleSalvarEdicao(e: FormEvent) {
        e.preventDefault();
        if (!usuarioEditando) return;
        setErro('');

        if (senha && senha !== confirmarSenha) {
            setErro('As senhas digitadas não coincidem.');
            return;
        }

        const cpfAlvo =
            cpf.replace(/\D/g, '') ||
            usuarioEditando.cpf ||
            String(Date.now()).slice(-11);

        setSalvando(true);
        try {
            const patchPayload: { login?: string; senha?: string } = {};
            if (login.trim() && login.trim() !== usuarioEditando.login) {
                patchPayload.login = login.trim();
            }
            if (senha) {
                patchPayload.senha = senha;
            }

            if (Object.keys(patchPayload).length > 0) {
                await usuarioService
                    .atualizarUsuario(cpfAlvo, patchPayload)
                    .catch(() => {});
            }

            if (usuarioEditando.cargo !== cargoSelecionado) {
                await usuarioService
                    .atualizarCargoCpf(cpfAlvo, cargoSelecionado)
                    .catch(() => {});
            }
        } finally {
            const atualizados = usuarios.map((u) =>
                u.login === usuarioEditando.login
                    ? {
                        ...u,
                        nome: nome.trim() || u.nome,
                        login: login.trim(),
                        cpf: cpfAlvo,
                        cargo: cargoSelecionado,
                    }
                    : u
            );
            setUsuarios(atualizados);
            salvarUsuariosLocais(atualizados);
            setModoTela('LISTAGEM');
            setSalvando(false);
        }
    }

    async function handleExcluirUsuario() {
        if (!usuarioParaExcluir) return;

        setSalvando(true);
        try {
            if (usuarioParaExcluir.cpf) {
                await usuarioService
                    .removerUsuario(usuarioParaExcluir.cpf)
                    .catch(() => {});
            }
        } finally {
            const atualizados = usuarios.filter(
                (u) => u.login !== usuarioParaExcluir.login
            );
            setUsuarios(atualizados);
            salvarUsuariosLocais(atualizados);
            setUsuarioParaExcluir(null);
            setSalvando(false);
        }
    }

    const perfilAtivoConfig = getConfigPerfil(cargoSelecionado);

    // ==========================================
    // VISÃO: NOVO USUÁRIO / EDITAR USUÁRIO
    // ==========================================
    if (modoTela === 'NOVO' || modoTela === 'EDITAR') {
        const isEdicao = modoTela === 'EDITAR';

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
                    <nav className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => setModoTela('LISTAGEM')}
                            className="cursor-pointer text-slate-400 hover:text-slate-600"
                        >
                            Usuários
                        </button>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold text-[#0E9F9E]">
              {isEdicao ? 'Editar usuário' : 'Novo usuário'}
            </span>
                    </nav>
                </div>

                {erro && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
                        {erro}
                    </div>
                )}

                <form
                    onSubmit={isEdicao ? handleSalvarEdicao : handleSalvarNovoUsuario}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                >
                    {/* Coluna Esquerda: Dados do Usuário */}
                    <div className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs lg:col-span-2">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                {isEdicao ? 'Editar usuário' : 'Novo usuário'}
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400">
                                {isEdicao
                                    ? 'Atualize as credenciais e o perfil de acesso do colaborador.'
                                    : 'Preencha as informações para criar um novo usuário no sistema.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Nome completo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Digite o nome completo"
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Login / E-mail institucional
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                    placeholder="Digite o login ou e-mail"
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    CPF
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    placeholder="000.000.000-00"
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                />
                            </div>

                            {!isEdicao && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-slate-700">
                                        Validade do acesso
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={dataLimite}
                                        onChange={(e) => setDataLimite(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    {isEdicao ? 'Nova senha (opcional)' : 'Senha inicial'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={mostrarSenha ? 'text' : 'password'}
                                        required={!isEdicao}
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        placeholder={
                                            isEdicao
                                                ? 'Deixe em branco para manter'
                                                : 'Ex: Senha@123'
                                        }
                                        className="w-full rounded-lg border border-slate-200 py-2.5 pr-10 pl-3.5 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setMostrarSenha((v) => !v)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                                    >
                                        {mostrarSenha ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-slate-700">
                                    Confirmar senha
                                </label>
                                <input
                                    type={mostrarSenha ? 'text' : 'password'}
                                    required={!isEdicao || Boolean(senha)}
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    placeholder="Confirme a senha"
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-[#0E9F9E] focus:outline-none"
                                />
                            </div>
                        </div>

                        <p className="text-[11px] text-slate-400">
                            A senha deve ter no mínimo 8 caracteres, incluindo letra
                            maiúscula, minúscula, número e caractere especial (ex:{' '}
                            <code className="text-slate-600">@#$%^&+=!_</code>).
                        </p>

                        {!isEdicao && (
                            <div className="hidden">
                                <input
                                    type="number"
                                    value={idAdmin}
                                    onChange={(e) => setIdAdmin(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                            <button
                                type="button"
                                onClick={() => setModoTela('LISTAGEM')}
                                className="cursor-pointer rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={salvando}
                                className="cursor-pointer rounded-lg bg-[#0E9F9E] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0B8281] disabled:opacity-60"
                            >
                                {salvando
                                    ? 'Salvando...'
                                    : isEdicao
                                        ? 'Salvar alterações'
                                        : 'Criar usuário'}
                            </button>
                        </div>
                    </div>

                    {/* Coluna Direita: Perfil de Acesso */}
                    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-xs">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Perfil de acesso
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400">
                                Escolha o perfil que melhor representa a função do usuário.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {PERFIS.map((perfil) => {
                                const selecionado = cargoSelecionado === perfil.cargo;
                                return (
                                    <button
                                        key={perfil.cargo}
                                        type="button"
                                        onClick={() => setCargoSelecionado(perfil.cargo)}
                                        className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                                            selecionado
                                                ? 'border-[#0E9F9E] bg-[#0E9F9E]/[0.03]'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                    <span
                        className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            selecionado
                                ? 'border-[#0E9F9E]'
                                : 'border-slate-300'
                        }`}
                    >
                      {selecionado && (
                          <span className="h-2 w-2 rounded-full bg-[#0E9F9E]" />
                      )}
                    </span>

                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${perfil.iconBg}`}
                                        >
                                            {perfil.cargo === 'MEDICO' && (
                                                <Stethoscope className="h-4 w-4" />
                                            )}
                                            {perfil.cargo === 'ENFERMAGEM' && (
                                                <HeartPulse className="h-4 w-4" />
                                            )}
                                            {perfil.cargo === 'MANUTENCAO' && (
                                                <Wrench className="h-4 w-4" />
                                            )}
                                            {perfil.cargo === 'ADMIN' && (
                                                <Shield className="h-4 w-4" />
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-slate-900">
                                                {perfil.titulo}
                                            </p>
                                            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                                                {perfil.descricao}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Box de Permissões do Perfil Selecionado */}
                        <div className="rounded-xl bg-emerald-50/70 p-4">
                            <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                                <Shield className="h-3.5 w-3.5 text-emerald-600" />
                                Permissões do perfil selecionado
                            </p>
                            <ul className="mt-2.5 space-y-1.5">
                                {perfilAtivoConfig.permissoes.map((perm) => (
                                    <li
                                        key={perm}
                                        className="flex items-center gap-2 text-[11px] text-slate-700"
                                    >
                                        <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                        {perm}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    // ==========================================
    // VISÃO: LISTAGEM DE USUÁRIOS
    // ==========================================
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Usuários</h1>
            </div>

            {erro && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    {erro}
                </div>
            )}

            {/* Barra de Busca e Ação */}
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
                            placeholder="Buscar usuário..."
                            className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#0E9F9E] focus:outline-none"
                        />
                    </div>

                    <select
                        value={filtroPerfil}
                        onChange={(e) => {
                            setFiltroPerfil(e.target.value);
                            setPaginaAtual(1);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-[#0E9F9E] focus:outline-none"
                    >
                        <option value="TODOS">Todos os perfis</option>
                        <option value="MEDICO">Médico</option>
                        <option value="ENFERMAGEM">Enfermagem</option>
                        <option value="MANUTENCAO">Manutenção</option>
                        <option value="ADMIN">Gerente</option>
                    </select>
                </div>

                <button
                    onClick={abrirNovoUsuario}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#0E9F9E] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-[#0B8281]"
                >
                    <Plus className="h-4 w-4" />
                    Novo usuário
                </button>
            </div>

            {/* Tabela de Usuários */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
                {loading ? (
                    <div className="flex h-64 items-center justify-center text-slate-500">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#0E9F9E]" />
                        Carregando usuários...
                    </div>
                ) : usuariosPaginados.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            Nenhum usuário encontrado.
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Clique em “Novo usuário” para cadastrar um colaborador.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-3.5">Usuário</th>
                                <th className="px-6 py-3.5">Login / E-mail</th>
                                <th className="px-6 py-3.5">Perfil</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Ações</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {usuariosPaginados.map((usuario) => {
                                const cfg = getConfigPerfil(usuario.cargo);
                                return (
                                    <tr
                                        key={usuario.login}
                                        className="transition-colors hover:bg-slate-50/70"
                                    >
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${cfg.avatarStyle}`}
                                                >
                                                    {getIniciais(usuario.nome)}
                                                </div>
                                                <span className="font-semibold text-slate-800">
                            {usuario.nome}
                          </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-slate-500">
                                            {usuario.login}
                                        </td>
                                        <td className="px-6 py-3.5">
                        <span
                            className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${cfg.badgeStyle}`}
                        >
                          {usuario.cargo ? cfg.titulo : 'Colaborador'}
                        </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                        <span className="inline-block rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                          Ativo
                        </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => abrirEditarUsuario(usuario)}
                                                    title="Editar usuário"
                                                    className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-100"
                                                >
                                                    <SquarePen className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setUsuarioParaExcluir(usuario)}
                                                    title="Excluir usuário"
                                                    className="cursor-pointer rounded-lg bg-red-50 p-1.5 text-red-600 transition-colors hover:bg-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Paginação */}
                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 text-xs text-slate-500">
          <span>
            Mostrando {usuariosPaginados.length} de {usuariosFiltrados.length}{' '}
              usuários
          </span>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={paginaAtual <= 1}
                            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                            className="cursor-pointer rounded-md border border-slate-200 p-1 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="rounded-md bg-[#0E9F9E] px-2.5 py-1 font-semibold text-white">
              {paginaAtual}
            </span>
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

            {/* Modal: Excluir Usuário */}
            {usuarioParaExcluir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <Trash2 className="h-5 w-5" />
                        </div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Excluir usuário?
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                            Tem certeza que deseja excluir o usuário{' '}
                            <strong className="text-slate-900">
                                {usuarioParaExcluir.nome}
                            </strong>
                            ?
                        </p>

                        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-left text-xs text-red-700">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span>
                Esta ação não pode ser desfeita. Todas as informações e acessos
                do usuário serão removidos permanentemente.
              </span>
                        </div>

                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                onClick={() => setUsuarioParaExcluir(null)}
                                className="cursor-pointer rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleExcluirUsuario}
                                disabled={salvando}
                                className="cursor-pointer rounded-lg bg-[#DC2626] px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {salvando ? 'Excluindo...' : 'Excluir usuário'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}