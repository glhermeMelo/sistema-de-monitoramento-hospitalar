import { api } from '../api/client';
import type {
    CpfCadastradoRequest,
    CpfCadastradoResponse,
    UsuarioCreateRequest,
    UsuarioPatchRequest,
    UsuarioResponse,
} from '../types/usuario';

export const usuarioService = {
    async listar(): Promise<UsuarioResponse[]> {
        const [usuariosRes, membrosRes] = await Promise.allSettled([
            api.get<UsuarioResponse[]>('/usuarios'),
            api.get<CpfCadastradoResponse[]>('/admins'),
        ]);

        const usuarios =
            usuariosRes.status === 'fulfilled' ? usuariosRes.value.data : [];
        const membros =
            membrosRes.status === 'fulfilled' ? membrosRes.value.data : [];

        // Cruza os usuários com a lista de CPFs autorizados para exibir o perfil/cargo
        return usuarios.map((u) => {
            const membro = u.cpf
                ? membros.find((m) => m.cpf === u.cpf)
                : undefined;
            return {
                ...u,
                cargo: membro?.cargo ?? u.cargo,
            };
        });
    },

    async cadastrarAutorizacaoCpf(
        payload: CpfCadastradoRequest
    ): Promise<CpfCadastradoResponse> {
        const { data } = await api.post<CpfCadastradoResponse>('/admins', payload);
        return data;
    },

    async cadastrarUsuario(
        payload: UsuarioCreateRequest
    ): Promise<UsuarioResponse> {
        const { data } = await api.post<UsuarioResponse>('/usuarios', payload);
        return data;
    },

    async atualizarUsuario(
        cpf: string,
        payload: UsuarioPatchRequest
    ): Promise<UsuarioResponse> {
        const { data } = await api.patch<UsuarioResponse>(
            `/usuarios/${cpf}`,
            payload
        );
        return data;
    },

    async atualizarCargoCpf(
        cpf: string,
        cargo: CpfCadastradoRequest['cargo']
    ): Promise<void> {
        await api.patch(`/admins/cpf/${cpf}`, { cargo });
    },

    async removerUsuario(cpf: string): Promise<void> {
        await api.delete(`/usuarios/${cpf}`);
    },
};