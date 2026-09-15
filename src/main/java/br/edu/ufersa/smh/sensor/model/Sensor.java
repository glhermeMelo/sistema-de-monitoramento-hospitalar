package br.edu.ufersa.smh.sensor.model;

import lombok.Getter;

@Getter
public abstract class Sensor {
    private IdSensor idSensor;
    private Integer intervaloLeitura;
    private TipoSensor tipo;
}