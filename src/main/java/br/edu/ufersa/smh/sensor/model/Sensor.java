package br.edu.ufersa.smh.sensor.model;

import br.edu.ufersa.smh.common.vo.IdSensor;
import lombok.Getter;

@Getter
public abstract class Sensor {
    private IdSensor idSensor;
    private Integer intervaloLeitura;
    private TipoSensor tipo;
}