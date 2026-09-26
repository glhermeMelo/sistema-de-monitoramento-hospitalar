package br.edu.ufersa.smh.admin.dto;

import br.edu.ufersa.smh.admin.model.CargoUsuario;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

@Validated
public record CpfCadastradoResponse(
        String cpf,
        CargoUsuario cargo,
        LocalDate dataLimiteHabilitado,
        Integer idAdmin
) {
}