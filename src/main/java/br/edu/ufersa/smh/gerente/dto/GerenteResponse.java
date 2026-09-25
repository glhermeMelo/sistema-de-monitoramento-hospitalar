package br.edu.ufersa.smh.gerente.dto;

import org.springframework.validation.annotation.Validated;

@Validated
public record GerenteResponse(
        Integer idGerente,
        String nome,
        String cpf,
        String login) {
}