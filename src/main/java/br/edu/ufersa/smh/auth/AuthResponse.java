package br.edu.ufersa.smh.auth;

import org.springframework.validation.annotation.Validated;

@Validated
public record AuthResponse(String token) {
}
