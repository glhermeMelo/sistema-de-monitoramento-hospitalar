package br.edu.ufersa.smh.common.vo;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Embeddable
public record Senha(
        @NotBlank(message = "A senha é obrigatória")
        @Size(max = 255, message = "A senha deve ter no máximo 255 caracteres")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_])(?=\\S+$).{8,}$",
                message = "A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial")
        String senha
) {
}