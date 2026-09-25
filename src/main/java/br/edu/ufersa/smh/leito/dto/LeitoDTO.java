package br.edu.ufersa.smh.leito.dto;

import br.edu.ufersa.smh.leito.model.StatusLeito;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;

@Validated
public record LeitoDTO(
        @NotNull(message = "O número do leito é obrigatório")
        @Min(value = 1, message = "O número do leito deve ser positivo")
        Integer numeroLeito,

        @NotBlank(message = "A localização do leito é obrigatória")
        @Size(max = 100, message = "A localização deve ter menos de 100 caracteres")
        String localizacao,
        StatusLeito statusLeito,
        @Min(value = 1, message = "O id do paciente deve ser maior que zero")
        Integer idPaciente) {
}