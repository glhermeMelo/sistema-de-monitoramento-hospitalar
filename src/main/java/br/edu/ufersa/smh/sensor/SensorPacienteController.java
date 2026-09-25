package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.sensor.dto.SensorPacienteDTO;
import br.edu.ufersa.smh.sensor.dto.SensorPacienteResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v3/pacientes/{idPaciente}/sensores")
public class SensorPacienteController {
    private final SensorPacienteService sensorPacienteService;

    @GetMapping
    public ResponseEntity<List<SensorPacienteResponse>> listar(
            @PathVariable Integer idPaciente) {
        return  ResponseEntity.ok(sensorPacienteService.listar(idPaciente));
    }

    @GetMapping("/{idSensor}")
    public ResponseEntity<SensorPacienteResponse> detalharSensorPaciente (
            @PathVariable Integer idPaciente,
            @PathVariable Integer idSensor) {
        return ResponseEntity.ok(sensorPacienteService.detalharSensorPaciente(idPaciente, idSensor));
    }

    @PostMapping
    public ResponseEntity<SensorPacienteDTO> cadastrar(
            @PathVariable Integer idPaciente,
            @RequestBody @Valid SensorPacienteDTO dto) {
        return null;
    }

}
