package br.edu.ufersa.smh.common.vo;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Embeddable
public record Nome(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres")
        @Pattern(
                regexp = "^[A-Za-zÀ-ÿ' ]+$",
                message = "O nome deve conter apenas letras e espaços")
        String nome) {
}