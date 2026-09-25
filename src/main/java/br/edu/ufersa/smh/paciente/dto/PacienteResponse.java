package br.edu.ufersa.smh.paciente.dto;

import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;

@Validated
public record PacienteResponse(
        Integer idPaciente,
        String nome,
        LocalDate dataNascimento
) {

}
