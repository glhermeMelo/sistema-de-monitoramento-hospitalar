package br.edu.ufersa.smh.sensor.model;

import lombok.Getter;

@Getter
public class SensorPaciente extends Sensor {
    private String idPaciente;
    private Integer pinosI2c;
    private Integer pinosOneWire;
}