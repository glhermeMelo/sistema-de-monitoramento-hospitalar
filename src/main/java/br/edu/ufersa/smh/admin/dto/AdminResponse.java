package br.edu.ufersa.smh.admin.dto;

import org.springframework.validation.annotation.Validated;

@Validated
public record AdminResponse(
        Integer idAdmin,
        String nome,
        String cpf,
        String login) {
}