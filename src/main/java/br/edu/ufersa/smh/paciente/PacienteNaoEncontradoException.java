package br.edu.ufersa.smh.paciente;

public class PacienteNaoEncontradoException extends RuntimeException {
    public PacienteNaoEncontradoException(String message) {
        super(message);
    }
}