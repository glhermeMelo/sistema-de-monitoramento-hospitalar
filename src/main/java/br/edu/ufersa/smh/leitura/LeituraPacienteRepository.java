package br.edu.ufersa.smh.leitura;

import br.edu.ufersa.smh.leitura.model.LeituraPaciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
interface LeituraPacienteRepository extends JpaRepository<LeituraPaciente, Integer> {
    List<LeituraPaciente> findAllByDataLeituraBetween(LocalDateTime inicio, LocalDateTime fim);
    List<LeituraPaciente> findAllByDataLeituraBefore(LocalDateTime fim);
    List<LeituraPaciente> findAllByDataLeituraAfter(LocalDateTime fim);
}