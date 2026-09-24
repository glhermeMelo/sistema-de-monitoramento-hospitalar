package br.edu.ufersa.smh.sensor.dto;

import br.edu.ufersa.smh.sensor.model.TipoSensor;
import org.springframework.validation.annotation.Validated;

@Validated
public record SensorAmbienteResponse(
        Integer idSensor,
        Integer idLeito,
        Integer intervaloLeitura,
        TipoSensor tipo,
        Integer pinosSdaScl,
        Integer pinoAnalogico) {
}