package br.edu.ufersa.smh.sensor.model;

import lombok.Getter;

@Getter
public class SensorPaciente extends Sensor {
    private IdPaciente idPaciente;
    private Integer pinosI2c;
    private Integer pinosOneWire;
}