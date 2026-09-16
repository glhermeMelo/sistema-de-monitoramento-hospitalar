package br.edu.ufersa.smh.common.vo;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Embeddable
public record Login(
        @NotBlank(message = "O login é obrigatório")
        @Size(max = 255, message = "O login deve ter no máximo 255 caracteres")
        String login) {
}