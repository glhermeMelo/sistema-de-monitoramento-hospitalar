package br.edu.ufersa.smh.auth;

import br.edu.ufersa.smh.admin.AdminRepository;
import br.edu.ufersa.smh.admin.CpfCadastradoRepository;
import br.edu.ufersa.smh.common.vo.Login;
import br.edu.ufersa.smh.usuario.Usuario;
import br.edu.ufersa.smh.usuario.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {
    private final UsuarioRepository usuarioRepository;
    private final AdminRepository adminRepository;
    private final CpfCadastradoRepository cpfCadastradoRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String login = username.trim();

        Optional<Usuario> usuario = usuarioRepository.findByLogin(new Login(login));
        if (usuario.isPresent()) {
            Usuario user = usuario.get();
            var cpfCadastrado = cpfCadastradoRepository.findByCpf(user.getCpf());

            String cargo = cpfCadastrado
                    .map(c -> c.getCargo().name())
                    .orElse("SEM_CARGO");

            boolean acessoVencido = cpfCadastrado
                    .map(c -> c.getDataLimiteHabilitado().isBefore(LocalDate.now()))
                    .orElse(true);

            return User.builder()
                    .username(login)
                    .password(user.getSenha().senha())
                    .roles(cargo)
                    .disabled(acessoVencido)
                    .build();
        }

        return adminRepository.findByLogin(new Login(login))
                .map(admin -> User.builder()
                        .username(login)
                        .password(admin.getSenha().senha())
                        .roles("ADMIN")
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuário: " + username + " não encontrado"));
    }
}
