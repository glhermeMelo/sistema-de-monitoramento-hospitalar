package br.edu.ufersa.smh.leitura;

import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v3/leitos/{numeroLeito}/leituras")
public class LeituraAmbienteController {
    private final LeituraAmbienteService leituraAmbienteService;

    @GetMapping
    public ResponseEntity<List<LeituraAmbienteResponse>> listar(
            @PathVariable Integer numeroLeito) {
        return ResponseEntity.ok(leituraAmbienteService.listarPorLeito(numeroLeito));
    }

    @GetMapping("/{idLeitura}")
    public ResponseEntity<LeituraAmbienteResponse> detalharLeitura(
            @PathVariable Integer numeroLeito,
            @PathVariable Integer idLeitura) {
        return ResponseEntity.ok(leituraAmbienteService.detalharLeituraAmbiente(numeroLeito, idLeitura));
    }
}
