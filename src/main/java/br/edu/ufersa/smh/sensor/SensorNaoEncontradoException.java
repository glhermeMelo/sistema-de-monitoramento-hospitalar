package br.edu.ufersa.smh.sensor;

public class SensorNaoEncontradoException extends RuntimeException {
    public SensorNaoEncontradoException(String message) {
        super(message);
    }
}