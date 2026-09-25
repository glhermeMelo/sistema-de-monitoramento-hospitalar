package br.edu.ufersa.smh.gerente;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufersa.smh.gerente.dto.CpfCadastradoDTO;
import br.edu.ufersa.smh.gerente.dto.CpfCadastradoPatchDTO;
import br.edu.ufersa.smh.gerente.dto.CpfCadastradoResponse;
import br.edu.ufersa.smh.leito.dto.LeitoResponse;
import br.edu.ufersa.smh.paciente.dto.PacienteResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/v3/gerentes")
public class GerenteController {
    private final GerenteService gerenteService;
    private final CpfCadastradoService cpfCadastradoService;

    @GetMapping
    public ResponseEntity<List<CpfCadastradoResponse>> listarMembros() {
        return null;
    }

    @PostMapping
    public ResponseEntity<CpfCadastradoResponse> cadastrarCpf(
            @RequestBody @Valid CpfCadastradoDTO dto) {
        return null;
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<CpfCadastradoResponse> detalharCpf(
            @PathVariable String cpf) {
        return null;
    }

    @PutMapping("/cpf/{cpf}")
    public ResponseEntity<CpfCadastradoResponse> atualizarCpfTotal(
            @PathVariable String cpf,
            @RequestBody @Valid CpfCadastradoDTO dto) {
        return null;
    }

    @PatchMapping("/cpf/{cpf}")
    public ResponseEntity<CpfCadastradoResponse> atualizarCpfParcial(
            @PathVariable String cpf,
            @RequestBody CpfCadastradoPatchDTO dto) {
        return null;
    }

    @DeleteMapping("/cpf/{cpf}")
    public ResponseEntity<Void> deletarCpf(
            @PathVariable String cpf) {
        return null;
    }

    @GetMapping("/pacientes")
    public ResponseEntity<List<PacienteResponse>> listarPacientes() {
        return null;
    }

    @GetMapping("/leitos")
    public ResponseEntity<List<LeitoResponse>> listarLeitos() {
        return null;
    }
}