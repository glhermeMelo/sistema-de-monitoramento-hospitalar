package br.edu.ufersa.smh.gerente;

public class GerenteNaoEncontradoException extends RuntimeException {
    public GerenteNaoEncontradoException(String message) {
        super(message);
    }
}