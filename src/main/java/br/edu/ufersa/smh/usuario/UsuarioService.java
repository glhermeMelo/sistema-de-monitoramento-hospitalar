package br.edu.ufersa.smh.usuario;

import br.edu.ufersa.smh.admin.CpfCadastradoRepository;
import br.edu.ufersa.smh.admin.exception.CpfNaoEncontradoException;
import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.Login;
import br.edu.ufersa.smh.common.vo.Nome;
import br.edu.ufersa.smh.common.vo.Senha;
import br.edu.ufersa.smh.usuario.dto.UsuarioDTO;
import br.edu.ufersa.smh.usuario.dto.UsuarioPatchDTO;
import br.edu.ufersa.smh.usuario.dto.UsuarioResponse;
import br.edu.ufersa.smh.usuario.exception.LoginEmUsoException;
import br.edu.ufersa.smh.usuario.exception.UsuarioJaCadastradoException;
import br.edu.ufersa.smh.usuario.exception.UsuarioNaoEncontradoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final CpfCadastradoRepository cpfCadastradoRepository;
    
    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public UsuarioResponse cadastrarUsuario(UsuarioDTO dto) {
       validarCadastro(dto);

        if (!cpfCadastradoRepository.existsByCpf(new Cpf(dto.cpf())))
            throw new CpfNaoEncontradoException("CPF não encontrado");

        return toResponse(usuarioRepository.save(toEntity(dto)));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarUsuarioPorCpf(String cpf) {
        return toResponse(usuarioRepository.findByCpf(new Cpf(cpf)).orElseThrow(
                () -> new UsuarioNaoEncontradoException("Usuário não cadastrado"))
        );
    }

    @Transactional
    public UsuarioResponse atualizarUsuario(String cpf, UsuarioPatchDTO dto) {
        Usuario usu = usuarioRepository.findByCpf(new Cpf(cpf)).orElseThrow(
                () -> new UsuarioNaoEncontradoException("Usuário não encontrado")
        );

        if (dto.login() != null && !dto.login().equals(usu.getLogin().login())) {
            if (existeLogin(new Login(dto.login())))
                throw new LoginEmUsoException("Login em uso");
            usu.trocarLogin(new Login(dto.login()));
        }

        if (dto.senha() != null)
            usu.trocarSenha(new Senha(dto.senha()));

        return toResponse(usuarioRepository.save(usu));
    }

    @Transactional
    public void deletarUsuarioPorCpf(String cpf) {

        Usuario usu =  usuarioRepository.findByCpf(new Cpf(cpf)).orElseThrow(
                () -> new UsuarioNaoEncontradoException("Usuário não encontrado")
        );
        usuarioRepository.delete(usu);
    }

    private UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getNome().nome(),
                usuario.getLogin().login());
    }

    private void validarCadastro(UsuarioDTO dto) {
        if (existeLogin(new Login(dto.login())))
            throw new LoginEmUsoException("Login em uso");
        if (existeUsuario(new Cpf(dto.cpf())))
            throw new UsuarioJaCadastradoException("Usuario ja cadastrado");
    }

    private Usuario toEntity(UsuarioDTO dto) {
        return new Usuario(
                new Nome(dto.nome()),
                new Cpf(dto.cpf()),
                new Login(dto.login()),
                new Senha(dto.senha())
        );
    }

    private boolean existeLogin(Login login) {
        return usuarioRepository.existsByLogin(login);
    }

    private boolean existeUsuario(Cpf cpf) {
        return usuarioRepository.existsByCpf(cpf);
    }
}