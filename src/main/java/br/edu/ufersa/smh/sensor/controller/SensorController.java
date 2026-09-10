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

import br.edu.ufersa.smh.sensor.dto.SensorDTO;
import br.edu.ufersa.smh.sensor.dto.SensorResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/sensores")
public class SensorController {

    @GetMapping
    public ResponseEntity<List<SensorResponse>> listarSensores() {
        return null;
    }

    @PostMapping
    public ResponseEntity<SensorResponse> cadastrarSensor(
            @RequestBody SensorDTO dto) {
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<SensorResponse> detalharSensor(
            @PathVariable Long id) {
        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<SensorResponse> atualizarSensorTotal(
            @PathVariable Long id,
            @RequestBody SensorDTO dto) {
        return null;
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SensorResponse> atualizarSensorParcial(
            @PathVariable Long id,
            @RequestBody SensorDTO dto) {
        return null;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarSensor(
            @PathVariable Long id) {
        return null;
    }
}