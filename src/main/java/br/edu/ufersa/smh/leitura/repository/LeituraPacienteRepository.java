package br.edu.ufersa.smh.leitura.repository;

import br.edu.ufersa.smh.leitura.model.LeituraPaciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LeituraPacienteRepository extends JpaRepository<LeituraPaciente, Integer> {
    List<LeituraPaciente> findAllByIdPaciente(String idPaciente);
    List<LeituraPaciente> findAllByDataLeituraBetween(LocalDateTime inicio, LocalDateTime fim);
    List<LeituraPaciente> findAllByDataLeituraBefore(LocalDateTime fim);
    List<LeituraPaciente> findAllByDataLeituraAfter(LocalDateTime fim);
}
