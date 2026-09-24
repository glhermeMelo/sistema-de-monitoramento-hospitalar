package br.edu.ufersa.smh.leitura.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "leitura")
@Inheritance(strategy = InheritanceType.JOINED)
@AllArgsConstructor
@NoArgsConstructor
@Getter
public abstract class Leitura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_leitura")
    private Integer idLeitura;

    @Column(name = "id_sensor", nullable = false)
    private Integer idSensor;

    @Column(name = "data_leitura", nullable = false)
    private LocalDateTime dataLeitura;

    public Leitura(Integer idSensor, LocalDateTime dataLeitura) {
        this.idSensor = idSensor;
        this.dataLeitura = dataLeitura;
    }
}