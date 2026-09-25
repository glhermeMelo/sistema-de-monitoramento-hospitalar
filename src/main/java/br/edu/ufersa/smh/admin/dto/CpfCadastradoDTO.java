package br.edu.ufersa.smh.admin.dto;

import br.edu.ufersa.smh.admin.model.CargoUsuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.validation.annotation.Validated;

@Validated
public record CpfCadastradoDTO(
        @NotBlank(message = "O cpf é obrigatório")
        @CPF(message = "O cpf é inválido")
        String cpf,

        @NotNull(message = "O cargo é obrigatório")
        CargoUsuario cargo,

        @NotNull(message = "O id do administrador é obrigatório")
        Integer idAdmin
) {
}