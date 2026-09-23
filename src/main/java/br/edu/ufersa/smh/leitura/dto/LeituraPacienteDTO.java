package br.edu.ufersa.smh.leitura.dto;

import jakarta.validation.constraints.NotNull;
import org.springframework.validation.annotation.Validated;

@Validated
public record LeituraPacienteDTO(
        @NotNull(message = "O id do sensor é obrigatório")
        Integer idSensor,

        Float temperaturaCorporal,
        Float spo2,
        Integer bpm
) {
}