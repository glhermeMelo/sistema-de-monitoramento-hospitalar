package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.sensor.dto.SensorAmbienteDTO;
import br.edu.ufersa.smh.sensor.dto.SensorAmbientePatchDTO;
import br.edu.ufersa.smh.sensor.dto.SensorAmbienteResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v3/leitos/{idLeito}/sensores")
public class SensorAmbienteController {
    private final SensorAmbienteService sensorAmbienteService;

    @GetMapping
    public ResponseEntity<List<SensorAmbienteResponse>> listar(
            @PathVariable Integer idLeito) {
        return ResponseEntity.ok(sensorAmbienteService.listar(idLeito));
    }

    @GetMapping("/{idSensor}")
    public ResponseEntity<SensorAmbienteResponse> detalharSensorAmbiente(
            @PathVariable Integer idLeito,
            @PathVariable Integer idSensor) {
        return ResponseEntity.ok(sensorAmbienteService.detalharSensorAmbiente(idLeito, idSensor));
    }

    @PostMapping
    public ResponseEntity<SensorAmbienteResponse> cadastrar(
            @PathVariable Integer idLeito,
            @RequestBody @Valid SensorAmbienteDTO dto) {
        SensorAmbienteResponse response = sensorAmbienteService.cadastrarSensorAmbiente(idLeito, dto);
        return ResponseEntity
                .created(URI.create("/api/v3/leitos/" + idLeito + "/sensores/" + response.idSensor()))
                .body(response);
    }

    @PutMapping("/{idSensor}")
    public ResponseEntity<SensorAmbienteResponse> atualizar(
            @PathVariable Integer idLeito,
            @PathVariable Integer idSensor,
            @RequestBody @Valid SensorAmbienteDTO dto) {
        return ResponseEntity.ok(sensorAmbienteService.atualizarTotal(idLeito, idSensor, dto));
    }

    @PatchMapping("/{idSensor}")
    public ResponseEntity<SensorAmbienteResponse> atualizarParcial(
            @PathVariable Integer idLeito,
            @PathVariable Integer idSensor,
            @RequestBody @Valid SensorAmbientePatchDTO dto) {
        return ResponseEntity.ok(sensorAmbienteService.atualizarParcial(idLeito, idSensor, dto));
    }

    @DeleteMapping("/{idSensor}")
    public ResponseEntity<Void> remover(
            @PathVariable Integer idLeito,
            @PathVariable Integer idSensor) {
        sensorAmbienteService.deletarSensor(idLeito, idSensor);
        return ResponseEntity.noContent().build();
    }
}
