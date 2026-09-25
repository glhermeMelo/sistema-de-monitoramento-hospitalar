package br.edu.ufersa.smh.usuario.dto;

import org.springframework.validation.annotation.Validated;

@Validated
public record UsuarioResponse(
        Integer idUsuario,
        String nome,
        String cpf,
        String login) {
}
