package br.edu.ufersa.smh.admin.dto;

import br.edu.ufersa.smh.admin.model.CargoUsuario;
import org.springframework.validation.annotation.Validated;

@Validated
public record CpfCadastradoPatchDTO(
        CargoUsuario cargo,
        Integer idAdmin
) {
}