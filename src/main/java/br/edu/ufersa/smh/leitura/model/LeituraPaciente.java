package br.edu.ufersa.smh.leitura.model;

import lombok.Getter;

@Getter
public class LeituraPaciente extends Leitura {
    private IdPaciente idPaciente;
    private Float temperaturaCorporal;
    private Float spo2;
    private Integer bpm;
}