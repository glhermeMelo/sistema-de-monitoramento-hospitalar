package br.edu.ufersa.smh.gerente;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.Login;
import br.edu.ufersa.smh.gerente.model.Gerente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GerenteRepository extends JpaRepository<Gerente, Integer> {
    boolean existsByCpf(Cpf cpf);
    boolean existsByLogin(Login login);

    Optional<Gerente> findByCpf(Cpf cpf);
    Optional<Gerente> findByLogin(Login login);
}
