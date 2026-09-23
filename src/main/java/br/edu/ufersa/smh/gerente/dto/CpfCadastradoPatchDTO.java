package br.edu.ufersa.smh.gerente.dto;

import br.edu.ufersa.smh.gerente.model.CargoUsuario;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;

@Validated
public record CpfCadastradoPatchDTO(
        CargoUsuario cargo,
        Integer idGerente,
        LocalDateTime dataHabilitado
) {
}