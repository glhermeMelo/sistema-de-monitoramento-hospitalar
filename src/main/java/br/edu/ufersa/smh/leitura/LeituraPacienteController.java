package br.edu.ufersa.smh.leitura;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufersa.smh.leitura.dto.LeituraPacienteResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pacientes/{idPaciente}/leituras")
public class LeituraPacienteController {
    private final LeituraPacienteService leituraPacienteService;

    @GetMapping
    public ResponseEntity<List<LeituraPacienteResponse>> listar(
            @PathVariable Integer idPaciente) {
        return ResponseEntity.ok(leituraPacienteService.listarPorPaciente(idPaciente));
    }

    @GetMapping("/{idLeitura}")
    public ResponseEntity<LeituraPacienteResponse> detalharLeitura(
            @PathVariable Integer idPaciente,
            @PathVariable Integer idLeitura) {
        return ResponseEntity.ok(leituraPacienteService.detalharLeituraPaciente(idPaciente, idLeitura));
    }
}