package br.edu.ufersa.smh.admin;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.admin.model.CargoUsuario;
import br.edu.ufersa.smh.admin.model.CpfCadastrado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CpfCadastradoRepository extends JpaRepository<CpfCadastrado, Cpf> {
    Optional<CpfCadastrado> findByCpf(Cpf cpf);
    boolean existsByCpf(Cpf cpf);
    List<CpfCadastrado> findAllByIdAdmin(Integer idAdmin);
    List<CpfCadastrado> findByCargo(CargoUsuario cargo);
    boolean existsByCargo(CargoUsuario cargo);
}