package br.edu.ufersa.smh.leitura.dto;

import org.springframework.validation.annotation.Validated;

@Validated
public record LeituraPacientePatchDTO(
        Integer idSensor,
        Float temperaturaCorporal,
        Float spo2,
        Integer bpm
) {
}