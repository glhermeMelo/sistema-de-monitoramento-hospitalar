package br.edu.ufersa.smh.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.validation.annotation.Validated;

@Validated
public record AdminDTO(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres")
        @Pattern(
                regexp = "^[A-Za-zÀ-ÿ' ]+$",
                message = "O nome deve conter apenas letras e espaços")
        String nome,

        @NotBlank(message = "O cpf é obrigatório")
        @CPF(message = "O cpf é inválido")
        String cpf,

        @NotBlank(message = "O login é obrigatório")
        @Size(max = 255, message = "O login deve ter no máximo 255 caracteres")
        String login,

        @NotBlank(message = "A senha é obrigatória")
        @Size(max = 255, message = "A senha deve ter no máximo 255 caracteres")
        @Pattern(
                regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_])(?=\\S+$).{8,}$",
                message = "A senha deve ter no mínimo 8 caracteres, com letra maiúscula, minúscula, número e caractere especial")
        String senha
) {
}