package br.edu.ufersa.smh.usuario.exception;

public class LoginEmUsoException extends RuntimeException {
    public LoginEmUsoException(String message) {
        super(message);
    }
}
