package br.edu.ufersa.smh.admin;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.Login;
import br.edu.ufersa.smh.admin.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Integer> {
    boolean existsByCpf(Cpf cpf);
    boolean existsByLogin(Login login);
    Optional<Admin> findByCpf(Cpf cpf);
    Optional<Admin> findByLogin(Login login);
}
