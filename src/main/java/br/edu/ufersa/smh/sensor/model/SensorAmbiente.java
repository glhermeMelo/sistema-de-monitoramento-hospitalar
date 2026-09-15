package br.edu.ufersa.smh.sensor.model;

import lombok.Getter;

@Getter
public class SensorAmbiente extends Sensor {
    private String idLeito;
    private Integer pinosSdaScl;
    private Integer pinoAnalogico;
}