package br.edu.ufersa.smh.leitura;

public class LeituraNaoEncontradaException extends RuntimeException {
    public LeituraNaoEncontradaException(String message) {
        super(message);
    }
}