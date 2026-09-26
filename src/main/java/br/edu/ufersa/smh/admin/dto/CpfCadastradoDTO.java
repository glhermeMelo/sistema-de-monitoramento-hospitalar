package br.edu.ufersa.smh.admin.dto;

import br.edu.ufersa.smh.admin.model.CargoUsuario;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

@Validated
public record CpfCadastradoDTO(
        @NotBlank(message = "O cpf é obrigatório")
        @CPF(message = "O cpf é inválido")
        String cpf,

        @NotNull(message = "O cargo é obrigatório")
        CargoUsuario cargo,

        @NotNull(message = "O id do administrador é obrigatório")
        Integer idAdmin,

        @NotNull(message = "A data limite é obrigatória")
        @FutureOrPresent(message = "A data limite deve ser hoje ou futura")
        LocalDate dataLimiteHabilitado
) {
}