package br.edu.ufersa.smh.sensor.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sensor_paciente")
@PrimaryKeyJoinColumn(name = "id_sensor")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class SensorPaciente extends Sensor {
    @Column(name = "id_paciente", nullable = false)
    private Integer idPaciente;

    @Column(name = "pinos_i2c", nullable = false)
    private Integer pinosI2c;

    @Column(name = "pinos_one_wire", nullable = false)
    private Integer pinosOneWire;
}