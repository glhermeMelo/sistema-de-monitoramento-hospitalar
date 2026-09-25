package br.edu.ufersa.smh.leito.dto;

import br.edu.ufersa.smh.leito.model.StatusLeito;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;

@Validated
public record LeitoPatchDTO(
        @Min(value = 1, message = "O número do leito deve ser positivo")
        Integer numeroLeito,

        @Size(max = 100, message = "A localização deve ter menos de 100 caracteres")
        String localizacao,
        StatusLeito statusLeito
) {
}