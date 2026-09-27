package br.edu.ufersa.smh.leito;

import java.net.URI;
import java.util.List;

import jakarta.annotation.security.RolesAllowed;
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

import br.edu.ufersa.smh.leito.dto.LeitoDTO;
import br.edu.ufersa.smh.leito.dto.LeitoPatchDTO;
import br.edu.ufersa.smh.leito.dto.LeitoResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RolesAllowed("MANUTENCAO")
@RequestMapping("/api/v3/leitos")
public class LeitoController {
    private final LeitoService leitoService;

    @GetMapping
    public ResponseEntity<List<LeitoResponse>> listarLeitos() {
        return ResponseEntity.ok(leitoService.listarLeitos());
    }

    @PostMapping
    public ResponseEntity<LeitoResponse> cadastrarLeito(
            @RequestBody @Valid LeitoDTO dto) {
        LeitoResponse response = leitoService.cadastrarLeito(dto);
        return ResponseEntity
                .created(URI.create("/api/v3/leitos/" + response.numeroLeito()))
                .body(response);
    }

    @GetMapping("/{numeroLeito}")
    public ResponseEntity<LeitoResponse> detalharLeito(
            @PathVariable Integer numeroLeito) {
        return ResponseEntity.ok(leitoService.detalharLeito(numeroLeito));
    }

    @PutMapping("/{numeroLeito}")
    public ResponseEntity<LeitoResponse> atualizarLeitoTotal(
            @PathVariable Integer numeroLeito,
            @RequestBody @Valid LeitoDTO dto) {
        return ResponseEntity.ok(leitoService.atualizarLeitoTotal(numeroLeito, dto));
    }

    @PatchMapping("/{numeroLeito}")
    public ResponseEntity<LeitoResponse> atualizarLeitoParcial(
            @PathVariable Integer numeroLeito,
            @RequestBody @Valid LeitoPatchDTO dto) {
        return ResponseEntity.ok(leitoService.atualizarLeitoParcial(numeroLeito, dto));
    }

    @DeleteMapping("/{numeroLeito}")
    public ResponseEntity<Void> removerLeito(
            @PathVariable Integer numeroLeito) {
        leitoService.removerLeito(numeroLeito);
        return ResponseEntity.noContent().build();
    }
}