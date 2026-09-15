package br.edu.ufersa.smh.leitura.model;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public abstract class Leitura {
    private IdLeitura idLeitura;
    private IdSensor idSensor;
    private LocalDateTime dataLeitura;
}