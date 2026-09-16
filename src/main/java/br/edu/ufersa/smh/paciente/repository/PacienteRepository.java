package br.edu.ufersa.smh.paciente.repository;

import br.edu.ufersa.smh.paciente.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Integer> {
}