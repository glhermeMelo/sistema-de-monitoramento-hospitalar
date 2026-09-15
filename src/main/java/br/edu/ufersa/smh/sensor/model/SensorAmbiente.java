package br.edu.ufersa.smh.sensor.model;

import br.edu.ufersa.smh.common.vo.IdLeito;
import lombok.Getter;

@Getter
public class SensorAmbiente extends Sensor {
    private IdLeito idLeito;
    private Integer pinosSdaScl;
    private Integer pinoAnalogico;
}