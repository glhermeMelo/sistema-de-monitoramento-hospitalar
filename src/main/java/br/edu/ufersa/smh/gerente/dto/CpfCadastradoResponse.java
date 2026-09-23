package br.edu.ufersa.smh.gerente.dto;

import br.edu.ufersa.smh.gerente.model.CargoUsuario;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;

@Validated
public record CpfCadastradoResponse(
        String cpf,
        CargoUsuario cargo,
        LocalDateTime dataHabilitado,
        Integer idGerente
) {
}