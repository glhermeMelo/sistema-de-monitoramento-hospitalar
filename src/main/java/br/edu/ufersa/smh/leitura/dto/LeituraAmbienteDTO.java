package br.edu.ufersa.smh.leitura.dto;

import jakarta.validation.constraints.NotNull;
import org.springframework.validation.annotation.Validated;

@Validated
public record LeituraAmbienteDTO(
        @NotNull(message = "O id do sensor é obrigatório")
        Integer idSensor,

        Float temperaturaAmbiente,
        Float umidadeAmbiente,
        Float pressaoAmbiente,
        Integer indiceTvoc,
        Integer indiceEco2,
        Float nivelRuido,
        Float nivelLuminosidade
) {
}