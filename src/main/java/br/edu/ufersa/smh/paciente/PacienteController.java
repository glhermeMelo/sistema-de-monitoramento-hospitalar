package br.edu.ufersa.smh.paciente;

import java.net.URI;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufersa.smh.paciente.dto.PacienteDTO;
import br.edu.ufersa.smh.paciente.dto.PacienteResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v3/pacientes")
public class PacienteController {
    private final PacienteService pacienteService;

    @GetMapping
    public ResponseEntity<List<PacienteResponse>> listarPacientes() {
        return  ResponseEntity.ok(pacienteService.listarPacientes());
    }

    @PostMapping
    public ResponseEntity<PacienteResponse> cadastrarPaciente(
            @RequestBody @Valid PacienteDTO dto) {
        PacienteResponse response = pacienteService.cadastrarPaciente(dto);
        return ResponseEntity
                .created(URI.create("/api/v3/pacientes/" + response.idPaciente()))
                .body(response);
    }

    @GetMapping("/{idPaciente}")
    public ResponseEntity<PacienteResponse> detalharPaciente(
            @PathVariable @NotNull Integer idPaciente) {
        return ResponseEntity.ok(pacienteService.buscarPaciente(idPaciente));
    }

    @DeleteMapping("/{idPaciente}")
    public ResponseEntity<Void> removerPaciente(
            @PathVariable @NotNull Integer idPaciente) {
        pacienteService.deletarPaciente(idPaciente);
        return ResponseEntity.noContent().build();
    }
}