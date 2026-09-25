package br.edu.ufersa.smh.common.vo;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Embeddable
public record Senha(
        @NotBlank(message = "A senha é obrigatória")
        @Size(max = 255, message = "A senha deve ter no máximo 255 caracteres")
        String senha) {
}