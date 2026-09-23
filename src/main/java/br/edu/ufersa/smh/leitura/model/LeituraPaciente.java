package br.edu.ufersa.smh.leitura.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "leitura_paciente")
@PrimaryKeyJoinColumn(name = "id_leitura")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LeituraPaciente extends Leitura {
    @Column(name = "id_paciente", nullable = false)
    private Integer idPaciente;

    @Column(name = "temperatura_corporal")
    private Float temperaturaCorporal;

    @Column(name = "spo2")
    private Float spo2;

    @Column(name = "bpm")
    private Integer bpm;
}