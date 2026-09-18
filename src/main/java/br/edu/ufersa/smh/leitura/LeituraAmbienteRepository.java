package br.edu.ufersa.smh.leitura;

import br.edu.ufersa.smh.leitura.model.LeituraAmbiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
interface LeituraAmbienteRepository extends JpaRepository<LeituraAmbiente, Integer> {
    List<LeituraAmbiente> findAllByDataLeituraBetween(LocalDateTime inicio, LocalDateTime fim);
    List<LeituraAmbiente> findAllByDataLeituraBefore(LocalDateTime fim);
    List<LeituraAmbiente> findAllByDataLeituraAfter(LocalDateTime fim);
}