package br.edu.ufersa.smh.leito.dto;

import br.edu.ufersa.smh.leito.model.StatusLeito;
import org.springframework.validation.annotation.Validated;

@Validated
public record LeitoResponse(
        Integer idLeito,
        Integer numeroLeito,
        String localizacao,
        StatusLeito statusLeito,
        Integer idPaciente
) {
}