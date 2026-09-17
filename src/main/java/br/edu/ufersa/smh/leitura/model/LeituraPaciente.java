package br.edu.ufersa.smh.leitura.model;

import java.time.LocalDateTime;

import br.edu.ufersa.smh.paciente.model.Paciente;
import br.edu.ufersa.smh.sensor.model.SensorPaciente;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "leitura_paciente")
@Getter
public class LeituraPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_leitura")
    private Integer idLeitura;


    @Column(name = "dados_leitura", nullable = false)
    private LocalDateTime dadosLeitura;

    @Column(name = "temperatura_corporal")
    private Float temperaturaCorporal;

    @Column(name = "spo2")
    private Float spo2;

    @Column(name = "bpm")
    private Integer bpm;
}