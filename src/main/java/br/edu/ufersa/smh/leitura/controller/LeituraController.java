package br.edu.ufersa.smh.leitura.controller;

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

import br.edu.ufersa.smh.leitura.dto.LeituraDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/leituras")
public class LeituraController {

    @GetMapping
    public ResponseEntity<List<LeituraResponse>> listarLeituras() {
        return null;
    }

    @PostMapping
    public ResponseEntity<LeituraResponse> cadastrarLeitura(
            @RequestBody LeituraDTO dto) {
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeituraResponse> detalharLeitura(
            @PathVariable Long id) {
        return null;
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeituraResponse> atualizarLeituraTotal(
            @PathVariable Long id,
            @RequestBody LeituraDTO dto) {
        return null;
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LeituraResponse> atualizarLeituraParcial(
            @PathVariable Long id,
            @RequestBody LeituraDTO dto) {
        return null;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLeitura(
            @PathVariable Long id) {
        return null;
    }
}
