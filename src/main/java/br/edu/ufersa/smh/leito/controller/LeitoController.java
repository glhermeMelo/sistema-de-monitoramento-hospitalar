package br.edu.ufersa.smh.leito.controller;

import java.util.List;

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
@RequestMapping("/api/v1/leitos")
public class LeitoController {

    @GetMapping
    public ResponseEntity<List<LeitoResponse>> listarLeitos() {
        return null;
    }

    @PostMapping
    public ResponseEntity<LeitoResponse> cadastrarLeito(
            @RequestBody LeitoDTO dto) {
        return null;
    }

    @GetMapping("/{idLeito}")
    public ResponseEntity<LeitoResponse> detalharLeito(
            @PathVariable Integer idLeito) {
        return null;
    }

    @PutMapping("/{idLeito}")
    public ResponseEntity<LeitoResponse> atualizarLeitoTotal(
            @PathVariable Integer idLeito,
            @RequestBody LeitoDTO dto) {
        return null;
    }

    @PatchMapping("/{idLeito}")
    public ResponseEntity<LeitoResponse> atualizarLeitoParcial(
            @PathVariable Integer idLeito,
            @RequestBody LeitoPatchDTO dto) {
        return null;
    }

    @DeleteMapping("/{idLeito}")
    public ResponseEntity<Void> removerLeito(
            @PathVariable Integer idLeito) {
        return null;
    }
}