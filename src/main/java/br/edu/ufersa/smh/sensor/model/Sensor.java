package br.edu.ufersa.smh.sensor.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "sensor")
@Inheritance(strategy = InheritanceType.JOINED)
@NoArgsConstructor
@Getter
public abstract class Sensor {
    @Id
    @Column(name = "id_sensor")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSensor;

    @Column(name = "intervalo_leitura", nullable = false)
    private Integer intervaloLeitura;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "tipo", nullable = false)
    private TipoSensor tipo;

    public Sensor(Integer intervaloLeitura, TipoSensor tipo) {
        this.intervaloLeitura = intervaloLeitura;
        this.tipo = tipo;
    }

    public Sensor(Integer idSensor, Integer intervaloLeitura, TipoSensor tipo) {
        this.idSensor = idSensor;
        this.intervaloLeitura = intervaloLeitura;
        this.tipo = tipo;
    }
}