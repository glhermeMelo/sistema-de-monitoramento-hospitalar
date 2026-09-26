package br.edu.ufersa.smh.paciente;

import br.edu.ufersa.smh.common.vo.Cpf;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
    boolean existsByCpf(Cpf cpf);
    Optional<Paciente> findByIdPaciente(Integer id);
    Optional<Paciente> findByCpf(Cpf cpf);

    List<Paciente> cpf(Cpf cpf);
}