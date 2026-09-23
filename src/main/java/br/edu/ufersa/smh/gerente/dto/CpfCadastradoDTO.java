package br.edu.ufersa.smh.gerente.dto;

import br.edu.ufersa.smh.gerente.model.CargoUsuario;
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

        @NotNull(message = "O id do gerente é obrigatório")
        Integer idGerente
) {
}