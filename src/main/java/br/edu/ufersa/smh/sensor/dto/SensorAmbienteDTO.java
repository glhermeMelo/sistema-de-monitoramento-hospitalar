package br.edu.ufersa.smh.sensor.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.validation.annotation.Validated;

@Validated
public record SensorAmbienteDTO(
        @NotNull(message = "O intervalo de leitura é obrigatório")
        @Min(value = 1, message = "O intervalo de leitura deve ser maior que zero")
        Integer intervaloLeitura,

        @NotNull(message = "O pino SDA/SCL é obrigatório")
        Integer pinosSdaScl,

        @NotNull(message = "O pino analógico é obrigatório")
        Integer pinoAnalogico) {
}