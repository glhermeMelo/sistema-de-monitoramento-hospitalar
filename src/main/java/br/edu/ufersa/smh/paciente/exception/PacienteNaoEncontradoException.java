package br.edu.ufersa.smh.paciente.exception;

public class PacienteNaoEncontradoException extends RuntimeException {
    public PacienteNaoEncontradoException(String message) {
        super(message);
    }
}