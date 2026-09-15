package br.edu.ufersa.smh.leitura.model;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public abstract class Leitura {
    private String idLeitura;
    private String idSensor;
    private LocalDateTime dataLeitura;
}