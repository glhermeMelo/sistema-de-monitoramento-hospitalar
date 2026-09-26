package br.edu.ufersa.smh.admin.dto;

import br.edu.ufersa.smh.admin.model.CargoUsuario;
import jakarta.validation.constraints.FutureOrPresent;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

@Validated
public record CpfCadastradoPatchDTO(
        CargoUsuario cargo,
        @FutureOrPresent(message = "A data limite deve ser hoje ou futura")
        LocalDate dataLimiteHabilitado
) {
}