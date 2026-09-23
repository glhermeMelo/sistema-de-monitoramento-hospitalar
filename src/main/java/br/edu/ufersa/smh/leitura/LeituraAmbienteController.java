package br.edu.ufersa.smh.leitura;

import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/leitos/{idLeito}/leituras")
public class LeituraAmbienteController {
    private final LeituraAmbienteService leituraAmbienteService;

    @GetMapping
    public ResponseEntity<List<LeituraAmbienteResponse>> listar(
            @PathVariable Integer idLeito) {
        return ResponseEntity.ok(leituraAmbienteService.listarPorLeito(idLeito));
    }

    @GetMapping("/{idLeitura}")
    public ResponseEntity<LeituraAmbienteResponse> detalharLeitura(
            @PathVariable Integer idLeito,
            @PathVariable Integer idLeitura) {
        return ResponseEntity.ok(leituraAmbienteService.detalharLeituraAmbiente(idLeito, idLeitura));
    }
}
