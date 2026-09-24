package br.edu.ufersa.smh.sensor.dto;

import jakarta.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;

@Validated
public record SensorPacientePatchDTO(
        @Min(value = 1, message = "O intervalo de leitura deve ser maior que zero")
        Integer intervaloLeitura,
        Integer pinosI2c,
        Integer pinosOneWire) {
}