package br.edu.ufersa.smh.leitura;

import br.edu.ufersa.smh.leitura.model.LeituraPaciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
interface LeituraPacienteRepository extends JpaRepository<LeituraPaciente, Integer> {
    List<LeituraPaciente> findAllByIdPaciente(Integer idPaciente);
    Optional<LeituraPaciente> findByIdPacienteAndIdLeitura(Integer idPaciente, Integer idLeitura);
    List<LeituraPaciente> findAllByDataLeituraBetween(LocalDateTime inicio, LocalDateTime fim);
    List<LeituraPaciente> findAllByDataLeituraBefore(LocalDateTime fim);
    List<LeituraPaciente> findAllByDataLeituraAfter(LocalDateTime fim);
}