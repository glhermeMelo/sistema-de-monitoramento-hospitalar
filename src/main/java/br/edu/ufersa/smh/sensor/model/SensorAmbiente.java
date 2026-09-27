package br.edu.ufersa.smh.sensor.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sensor_ambiente")
@PrimaryKeyJoinColumn(name = "id_sensor")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class SensorAmbiente extends Sensor {
    @Column(name = "numero_leito", nullable = false)
    private Integer numeroLeito;

    @Column(name = "pinos_sda_scl", nullable = false)
    private Integer pinosSdaScl;

    @Column(name = "pino_analogico", nullable = false)
    private Integer pinoAnalogico;

    public SensorAmbiente(Integer intervaloLeitura, TipoSensor tipo, Integer numeroLeito, Integer pinosSdaScl, Integer pinoAnalogico) {
        super(intervaloLeitura, tipo);
        this.numeroLeito = numeroLeito;
        this.pinosSdaScl = pinosSdaScl;
        this.pinoAnalogico = pinoAnalogico;
    }

    public SensorAmbiente(Integer idSensor, Integer intervaloLeitura, TipoSensor tipo, Integer numeroLeito, Integer pinosSdaScl, Integer pinoAnalogico) {
        super(idSensor, intervaloLeitura, tipo);
        this.numeroLeito = numeroLeito;
        this.pinosSdaScl = pinosSdaScl;
        this.pinoAnalogico = pinoAnalogico;
    }
}