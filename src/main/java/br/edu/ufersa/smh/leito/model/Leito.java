package br.edu.ufersa.smh.leito.model;

import lombok.Getter;

@Getter
public class Leito {
    private String idLeito;
    private Integer numeroLeito;
    private String localizacao;
    private StatusLeito statusLeito;
    private String idPaciente;
}