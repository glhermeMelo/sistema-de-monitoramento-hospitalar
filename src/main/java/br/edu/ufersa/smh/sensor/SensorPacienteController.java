package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.sensor.dto.SensorPacienteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
