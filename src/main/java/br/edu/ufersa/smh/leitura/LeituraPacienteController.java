package br.edu.ufersa.smh.leitura;

import java.util.List;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.Valid;
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

import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbientePatchDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteResponse;
import br.edu.ufersa.smh.leitura.dto.LeituraPacienteDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraPacientePatchDTO;
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
        return null;
    }

    @PostMapping
    public ResponseEntity<LeituraPacienteResponse> cadastrar(
            @PathVariable Integer idPaciente,
            @RequestBody @Valid LeituraPacienteDTO dto) {
        return null;
    }

    @GetMapping("/{idLeitura}")
    public ResponseEntity<LeituraPacienteResponse> detalharLeitura(
            @PathVariable Integer idPaciente,
            @PathVariable Integer idLeitura) {
        return null;
    }

    @PutMapping("/{idLeitura}")
    public ResponseEntity<LeituraPacienteResponse> atualizarLeituraTotal(
            @PathVariable Integer idPaciente,
            @PathVariable Integer idLeitura,
            @RequestBody @Valid LeituraPacienteDTO dto) {
        return null;
    }

    @PatchMapping("/{idLeitura}")
    public ResponseEntity<LeituraPacienteResponse> atualizarLeituraParcial(
            @PathVariable Integer idPaciente,
            @PathVariable Integer idLeitura,
            @RequestBody @Valid LeituraPacientePatchDTO dto) {
        return null;
    }

    @DeleteMapping("/{idLeitura}")
    public ResponseEntity<Void> remover(
            @PathVariable Integer idPaciente,
            @PathVariable Integer idLeitura) {
        return null;
    }
}