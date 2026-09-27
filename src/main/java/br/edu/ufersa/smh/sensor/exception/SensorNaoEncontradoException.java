package br.edu.ufersa.smh.sensor.exception;

public class SensorNaoEncontradoException extends RuntimeException {
    public SensorNaoEncontradoException(String message) {
        super(message);
    }
}