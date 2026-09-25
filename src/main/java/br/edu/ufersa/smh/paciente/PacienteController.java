package br.edu.ufersa.smh.paciente;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<PacienteResponse>> listarPacientes() {
        return null;
    }

    @PostMapping
    public ResponseEntity<PacienteResponse> cadastrarPaciente(
            @RequestBody PacienteDTO dto) {
        return null;
    }

    @GetMapping("/{idPaciente}")
    public ResponseEntity<PacienteResponse> detalharPaciente(
            @PathVariable Integer idPaciente) {
        return null;
    }

    @DeleteMapping("/{idPaciente}")
    public ResponseEntity<Void> removerPaciente(
            @PathVariable Integer idPaciente) {
        return null;
    }
}