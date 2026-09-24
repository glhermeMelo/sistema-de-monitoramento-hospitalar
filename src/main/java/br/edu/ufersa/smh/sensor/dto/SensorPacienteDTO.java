package br.edu.ufersa.smh.sensor.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.validation.annotation.Validated;

@Validated
public record SensorPacienteDTO(
        @NotNull(message = "O intervalo de leitura é obrigatório")
        @Min(value = 1, message = "O intervalo de leitura deve ser maior que zero")
        Integer intervaloLeitura,

        @NotNull(message = "O pino I2C é obrigatório")
        Integer pinosI2c,

        @NotNull(message = "O pino One Wire é obrigatório")
        Integer pinosOneWire) {
}