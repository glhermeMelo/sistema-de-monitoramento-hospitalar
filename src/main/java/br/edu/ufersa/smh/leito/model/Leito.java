package br.edu.ufersa.smh.leito.model;

import br.edu.ufersa.smh.common.vo.IdLeito;
import br.edu.ufersa.smh.common.vo.IdPaciente;
import lombok.Getter;

@Getter
public class Leito {
    private IdLeito idLeito;
    private Integer numeroLeito;
    private String localizacao;
    private StatusLeito statusLeito;
    private IdPaciente idPaciente;
}