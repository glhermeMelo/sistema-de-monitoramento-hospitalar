package br.edu.ufersa.smh.leito;

public class LeitoNaoEncontradoException extends RuntimeException {
    public LeitoNaoEncontradoException(String message) {
        super(message);
    }
}