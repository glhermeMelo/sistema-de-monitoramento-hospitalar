package br.edu.ufersa.smh.auth;

import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;

@Validated
public record AuthDTO(
        @NotBlank(message = "O login é obrigatório") String login,
        @NotBlank(message = "A senha é obrigatória") String senha) {
}
