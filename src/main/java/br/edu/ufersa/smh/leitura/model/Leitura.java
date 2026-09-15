package br.edu.ufersa.smh.leitura.model;

import java.time.LocalDateTime;

import br.edu.ufersa.smh.common.vo.IdLeitura;
import br.edu.ufersa.smh.common.vo.IdSensor;
import lombok.Getter;

@Getter
public abstract class Leitura {
    private IdLeitura idLeitura;
    private IdSensor idSensor;
    private LocalDateTime dataLeitura;
}