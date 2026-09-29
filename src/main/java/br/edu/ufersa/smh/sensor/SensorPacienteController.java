package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.sensor.dto.SensorPacienteDTO;
import br.edu.ufersa.smh.sensor.dto.SensorPacientePatchDTO;
import br.edu.ufersa.smh.sensor.dto.SensorPacienteResponse;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RolesAllowed("MANUTENCAO")
@RequestMapping("/api/v3/pacientes/{idPaciente}/sensores")
public class SensorPacienteController {
    private final SensorPacienteService sensorPacienteService;

    @GetMapping
    public ResponseEntity<List<SensorPacienteResponse>> listar(
            @PathVariable Integer idPaciente) {
        return ResponseEntity.ok(sensorPacienteService.listar(idPaciente));
    }

    @GetMapping("/{idSensor}")
    public ResponseEntity<SensorPacienteResponse> detalharSensorPaciente(
            @PathVariable Integer idPaciente,
            @PathVariable Integer idSensor) {
        return ResponseEntity.ok(sensorPacienteService.detalharSensorPaciente(idPaciente, idSensor));
    }

    @PostMapping
    public ResponseEntity<SensorPacienteResponse> cadastrar(
            @PathVariable Integer idPaciente,
            @RequestBody @Valid SensorPacienteDTO dto) {
        SensorPacienteResponse response = sensorPacienteService.cadastrarSensorPaciente(idPaciente, dto);
        return ResponseEntity
                .created(URI.create("/api/v3/pacientes/" + idPaciente + "/sensores/" + response.idSensor()))
                .body(response);
    }

    @PutMapping("/{idSensor}")
    public ResponseEntity<SensorPacienteResponse> atualizar(
            @PathVariable Integer idPaciente,
            @PathVariable Integer idSensor,
            @RequestBody @Valid SensorPacienteDTO dto) {
        return ResponseEntity.ok(sensorPacienteService.atualizarTotal(idPaciente, idSensor, dto));
    }

    @PatchMapping("/{idSensor}")
    public ResponseEntity<SensorPacienteResponse> atualizarParcial(
            @PathVariable Integer idPaciente,
            @PathVariable Integer idSensor,
            @RequestBody @Valid SensorPacientePatchDTO dto) {
        return ResponseEntity.ok(sensorPacienteService.atualizarParcial(idPaciente, idSensor, dto));
    }

    @DeleteMapping("/{idSensor}")
    public ResponseEntity<Void> remover(
            @PathVariable Integer idPaciente,
            @PathVariable Integer idSensor) {
        sensorPacienteService.deletarSensor(idPaciente, idSensor);
        return ResponseEntity.noContent().build();
    }
}
