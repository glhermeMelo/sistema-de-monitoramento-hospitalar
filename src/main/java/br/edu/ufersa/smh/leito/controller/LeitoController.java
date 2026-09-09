package br.edu.ufersa.smh.leito.controller;

import br.edu.ufersa.smh.leito.dto.LeitoDTO;
import br.edu.ufersa.smh.leito.dto.LeitoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/leitos")
public class LeitoController {
    @GetMapping
    public ResponseEntity<List<LeitoResponse>> listarLeitos() {
        return null;
    }

    @GetMapping("/{idLeito}")
    public ResponseEntity<LeitoResponse> buscarLeito(
            @PathVariable Integer idLeito,
            @RequestBody LeitoDTO dto) {
        return null;
    }
}
