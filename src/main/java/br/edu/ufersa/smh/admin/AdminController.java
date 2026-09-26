package br.edu.ufersa.smh.admin;

import java.net.URI;
import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufersa.smh.admin.dto.CpfCadastradoDTO;
import br.edu.ufersa.smh.admin.dto.CpfCadastradoPatchDTO;
import br.edu.ufersa.smh.admin.dto.CpfCadastradoResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/api/v3/admins")
public class AdminController {
    private final CpfCadastradoService cpfCadastradoService;

    @GetMapping
    public ResponseEntity<List<CpfCadastradoResponse>> listarMembros() {
        return ResponseEntity.ok(cpfCadastradoService.listarMembros());
    }

    @PostMapping
    public ResponseEntity<CpfCadastradoResponse> cadastrarCpf(
            @RequestBody @Valid CpfCadastradoDTO dto) {
        return ResponseEntity
                .created(URI.create("/api/v3/admins/cpf/" + dto.cpf()))
                .body(cpfCadastradoService.cadastrarCpf(dto));
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<CpfCadastradoResponse> detalharCpf(
            @PathVariable String cpf) {
        return ResponseEntity.ok(cpfCadastradoService.detalharCpf(cpf));
    }

    @PatchMapping("/cpf/{cpf}")
    public ResponseEntity<CpfCadastradoResponse> atualizarCpf(
            @PathVariable String cpf,
            @RequestBody @Valid CpfCadastradoPatchDTO dto) {
        return ResponseEntity.ok(cpfCadastradoService.atualizarCpf(cpf, dto));
    }

    @DeleteMapping("/cpf/{cpf}")
    public ResponseEntity<Void> deletarCpf(
            @PathVariable String cpf) {
        cpfCadastradoService.removerCpf(cpf);
        return ResponseEntity.noContent().build();
    }
}