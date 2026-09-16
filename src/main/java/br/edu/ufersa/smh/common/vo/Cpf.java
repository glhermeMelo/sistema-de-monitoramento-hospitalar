package br.edu.ufersa.smh.common.vo;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.br.CPF;

@Embeddable
public record Cpf(
        @NotBlank(message = "O cpf é obrigatório")
        @CPF(message = "O cpf é inválido")
        String cpf) {
}