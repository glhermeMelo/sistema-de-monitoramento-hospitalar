package br.edu.ufersa.smh.paciente;

import br.edu.ufersa.smh.common.vo.Cpf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    List<Paciente> findAllByAtivoTrue();
    boolean existsByCpf(Cpf cpf);
    Optional<Paciente> findByIdPaciente(Integer id);
    Optional<Paciente> findByCpf(Cpf cpf);
}