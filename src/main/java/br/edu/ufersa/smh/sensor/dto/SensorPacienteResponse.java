package br.edu.ufersa.smh.sensor.dto;

import br.edu.ufersa.smh.sensor.model.TipoSensor;
import org.springframework.validation.annotation.Validated;

@Validated
public record SensorPacienteResponse(
        Integer idSensor,
        Integer idPaciente,
        Integer intervaloLeitura,
        TipoSensor tipo,
        Integer pinosI2c,
        Integer pinosOneWire) {
}