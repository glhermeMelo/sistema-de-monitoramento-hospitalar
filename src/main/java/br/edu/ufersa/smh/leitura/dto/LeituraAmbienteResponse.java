package br.edu.ufersa.smh.leitura.dto;

import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;

@Validated
public record LeituraAmbienteResponse(
        Integer idLeitura,
        Integer idSensor,
        Integer idLeito,
        LocalDateTime dataLeitura,
        Float temperaturaAmbiente,
        Float umidadeAmbiente,
        Float pressaoAmbiente,
        Integer indiceTvoc,
        Integer indiceEco2,
        Float nivelRuido,
        Float nivelLuminosidade
) {
}