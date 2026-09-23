package br.edu.ufersa.smh.leitura.dto;

import org.springframework.validation.annotation.Validated;

@Validated
public record LeituraAmbientePatchDTO(
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