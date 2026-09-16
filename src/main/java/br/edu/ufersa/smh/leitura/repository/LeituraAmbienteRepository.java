package br.edu.ufersa.smh.leitura.repository;

import br.edu.ufersa.smh.leitura.model.LeituraAmbiente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LeituraAmbienteRepository extends JpaRepository<LeituraAmbiente, Integer> {
    List<LeituraAmbiente> findAllByIdLeito(String idLeito);
    List<LeituraAmbiente> findAllByDataLeituraBetween(LocalDateTime inicio, LocalDateTime fim);
    List<LeituraAmbiente> findAllByDataLeituraBefore(LocalDateTime fim);
    List<LeituraAmbiente> findAllByDataLeituraAfter(LocalDateTime fim);
}
