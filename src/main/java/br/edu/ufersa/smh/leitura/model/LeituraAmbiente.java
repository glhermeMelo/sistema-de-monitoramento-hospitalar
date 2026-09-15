package br.edu.ufersa.smh.leitura.model;

import lombok.Getter;

@Getter
public class LeituraAmbiente extends Leitura {
    private String idLeito;
    private Float temperaturaAmbiente;
    private Float umidadeAmbiente;
    private Float pressaoAmbiente;
    private Integer indiceTvoc;
    private Integer indiceEco2;
    private Float nivelRuido;
    private Float nivelLuminosidade;
}