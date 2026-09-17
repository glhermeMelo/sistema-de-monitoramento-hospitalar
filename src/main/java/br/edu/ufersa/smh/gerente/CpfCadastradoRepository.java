package br.edu.ufersa.smh.gerente;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.gerente.model.CargoUsuario;
import br.edu.ufersa.smh.gerente.model.CpfCadastrado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CpfCadastradoRepository extends JpaRepository<CpfCadastrado, Cpf> {
    List<CpfCadastrado> findAllByIdGerente(Integer idGerente);
    List<CpfCadastrado> findByCargo(CargoUsuario cargo);
    boolean existsByCargo(CargoUsuario cargo);

}