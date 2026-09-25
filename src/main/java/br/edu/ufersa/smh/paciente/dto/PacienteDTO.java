package br.edu.ufersa.smh.paciente.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

@Validated
public record PacienteDTO(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres")
        @Pattern(
                regexp = "^[A-Za-zÀ-ÿ' ]+$",
                message = "O nome deve conter apenas letras e espaços")
        String nome,

        @NotBlank(message = "O cpf é obrigatório")
        @CPF(message = "O cpf é inválido")
        String cpf,

        @NotNull
        @Past(message = "A data de nascimento deve ser passada")
        @JsonFormat(pattern = "dd/MM/yyyy")
        LocalDate dataNascimento
) {

}
