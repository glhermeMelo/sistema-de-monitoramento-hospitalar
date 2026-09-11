package br.edu.ufersa.smh.sensor.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufersa.smh.sensor.dto.SensorAmbienteDTO;
import br.edu.ufersa.smh.sensor.dto.SensorAmbientePatchDTO;
import br.edu.ufersa.smh.sensor.dto.SensorAmbienteResponse;
import br.edu.ufersa.smh.sensor.dto.SensorPacienteDTO;
import br.edu.ufersa.smh.sensor.dto.SensorPacientePatchDTO;
import br.edu.ufersa.smh.sensor.dto.SensorPacienteResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/sensores")
public class SensorController {

    @GetMapping("/paciente")
    public ResponseEntity<List<SensorPacienteResponse>> listarSensoresPaciente() {
        return null;
    }

    @GetMapping("/paciente/{idSensor}")
    public ResponseEntity<SensorPacienteResponse> detalharSensorPaciente(
            @PathVariable String idSensor) {
        return null;
    }

    @PostMapping("/paciente")
    public ResponseEntity<SensorPacienteResponse> cadastrarSensorPaciente(
            @RequestBody SensorPacienteDTO dto) {
        return null;
    }

    @PutMapping("/paciente/{idSensor}")
    public ResponseEntity<SensorPacienteResponse> atualizarSensorPacienteTotal(
            @PathVariable String idSensor,
            @RequestBody SensorPacienteDTO dto) {
        return null;
    }

    @PatchMapping("/paciente/{idSensor}")
    public ResponseEntity<SensorPacienteResponse> atualizarSensorPacienteParcial(
            @PathVariable String idSensor,
            @RequestBody SensorPacientePatchDTO dto) {
        return null;
    }

    @DeleteMapping("/paciente/{idSensor}")
    public ResponseEntity<Void> deletarSensorPaciente(
            @PathVariable String idSensor) {
        return null;
    }

    @GetMapping("/ambiente")
    public ResponseEntity<List<SensorAmbienteResponse>> listarSensoresAmbiente() {
        return null;
    }

    @GetMapping("/ambiente/{idSensor}")
    public ResponseEntity<SensorAmbienteResponse> detalharSensorAmbiente(
            @PathVariable String idSensor) {
        return null;
    }

    @PostMapping("/ambiente")
    public ResponseEntity<SensorAmbienteResponse> cadastrarSensorAmbiente(
            @RequestBody SensorAmbienteDTO dto) {
        return null;
    }

    @PutMapping("/ambiente/{idSensor}")
    public ResponseEntity<SensorAmbienteResponse> atualizarSensorAmbienteTotal(
            @PathVariable String idSensor,
            @RequestBody SensorAmbienteDTO dto) {
        return null;
    }

    @PatchMapping("/ambiente/{idSensor}")
    public ResponseEntity<SensorAmbienteResponse> atualizarSensorAmbienteParcial(
            @PathVariable String idSensor,
            @RequestBody SensorAmbientePatchDTO dto) {
        return null;
    }

    @DeleteMapping("/ambiente/{idSensor}")
    public ResponseEntity<Void> deletarSensorAmbiente(
            @PathVariable String idSensor) {
        return null;
    }
}