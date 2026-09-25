package br.edu.ufersa.smh.gerente.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;

@Validated
public record GerentePatchDTO(
        @Size(max = 255, message = "O login deve ter no máximo 255 caracteres")
        String login,

        @Size(max = 255, message = "A senha deve ter no máximo 255 caracteres")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_])(?=\\S+$).{8,}$",
                message = "A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial")
        String senha) {
}