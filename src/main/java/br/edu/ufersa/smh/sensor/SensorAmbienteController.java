package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.sensor.dto.SensorAmbienteDTO;
import br.edu.ufersa.smh.sensor.dto.SensorAmbientePatchDTO;
import br.edu.ufersa.smh.sensor.dto.SensorAmbienteResponse;
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
@RequestMapping("/api/v3/leitos/{numeroLeito}/sensores")
public class SensorAmbienteController {
    private final SensorAmbienteService sensorAmbienteService;

    @GetMapping
    public ResponseEntity<List<SensorAmbienteResponse>> listar(
            @PathVariable Integer numeroLeito) {
        return ResponseEntity.ok(sensorAmbienteService.listar(numeroLeito));
    }

    @GetMapping("/{idSensor}")
    public ResponseEntity<SensorAmbienteResponse> detalharSensorAmbiente(
            @PathVariable Integer numeroLeito,
            @PathVariable Integer idSensor) {
        return ResponseEntity.ok(sensorAmbienteService.detalharSensorAmbiente(numeroLeito, idSensor));
    }

    @PostMapping
    public ResponseEntity<SensorAmbienteResponse> cadastrar(
            @PathVariable Integer numeroLeito,
            @RequestBody @Valid SensorAmbienteDTO dto) {
        SensorAmbienteResponse response = sensorAmbienteService.cadastrarSensorAmbiente(numeroLeito, dto);
        return ResponseEntity
                .created(URI.create("/api/v3/leitos/" + numeroLeito + "/sensores/" + response.idSensor()))
                .body(response);
    }

    @PutMapping("/{idSensor}")
    public ResponseEntity<SensorAmbienteResponse> atualizar(
            @PathVariable Integer numeroLeito,
            @PathVariable Integer idSensor,
            @RequestBody @Valid SensorAmbienteDTO dto) {
        return ResponseEntity.ok(sensorAmbienteService.atualizarTotal(numeroLeito, idSensor, dto));
    }

    @PatchMapping("/{idSensor}")
    public ResponseEntity<SensorAmbienteResponse> atualizarParcial(
            @PathVariable Integer numeroLeito,
            @PathVariable Integer idSensor,
            @RequestBody @Valid SensorAmbientePatchDTO dto) {
        return ResponseEntity.ok(sensorAmbienteService.atualizarParcial(numeroLeito, idSensor, dto));
    }

    @DeleteMapping("/{idSensor}")
    public ResponseEntity<Void> remover(
            @PathVariable Integer numeroLeito,
            @PathVariable Integer idSensor) {
        sensorAmbienteService.deletarSensor(numeroLeito, idSensor);
        return ResponseEntity.noContent().build();
    }
}
