package br.edu.ufersa.smh.sensor.model;

import br.edu.ufersa.smh.common.vo.IdPaciente;
import lombok.Getter;

@Getter
public class SensorPaciente extends Sensor {
    private IdPaciente idPaciente;
    private Integer pinosI2c;
    private Integer pinosOneWire;
}