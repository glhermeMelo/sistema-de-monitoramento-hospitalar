package br.edu.ufersa.smh.leitura.dto;

import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;

@Validated
public record LeituraPacienteResponse(
        Integer idLeitura,
        Integer idSensor,
        Integer idPaciente,
        LocalDateTime dataLeitura,
        Float temperaturaCorporal,
        Float spo2,
        Integer bpm
) {
}