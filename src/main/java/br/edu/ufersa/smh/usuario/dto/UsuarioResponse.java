package br.edu.ufersa.smh.usuario.dto;

import org.springframework.validation.annotation.Validated;

@Validated
public record UsuarioResponse(
        String nome,
        String login) {
}
