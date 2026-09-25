package br.edu.ufersa.smh.usuario;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    boolean existsByCpf(Cpf cpf);
    boolean existsByLogin(Login login);
    Optional<Usuario> findByCpf(Cpf cpf);
    Optional<Usuario> findByLogin(Login login);
}