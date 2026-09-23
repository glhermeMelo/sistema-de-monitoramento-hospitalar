package br.edu.ufersa.smh.gerente;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.gerente.model.CargoUsuario;
import br.edu.ufersa.smh.gerente.model.CpfCadastrado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
interface CpfCadastradoRepository extends JpaRepository<CpfCadastrado, Cpf> {
    Optional<CpfCadastrado> findByCpf(Cpf cpf);
    boolean existsByCpf(Cpf cpf);
    List<CpfCadastrado> findAllByIdGerente(Integer idGerente);
    List<CpfCadastrado> findByCargo(CargoUsuario cargo);
    boolean existsByCargo(CargoUsuario cargo);
}