package br.edu.ufersa.smh.leitura;

import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbientePatchDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteResponse;
import jakarta.validation.Valid;
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
        return null;
    }

    @PostMapping
    public ResponseEntity<LeituraAmbienteResponse> cadastrar(
            @PathVariable Integer idLeito,
            @RequestBody @Valid LeituraAmbienteDTO dto) {
        return null;
    }

    @GetMapping("/{idLeitura}")
    public ResponseEntity<LeituraAmbienteResponse> detalhar(
            @PathVariable Integer idLeito,
            @PathVariable Integer idLeitura) {
        return null;
    }

    @PutMapping("/{idLeitura}")
    public ResponseEntity<LeituraAmbienteResponse> atualizarLeituraTotal(
            @PathVariable Integer idLeito,
            @PathVariable Integer idLeitura,
            @RequestBody @Valid LeituraAmbienteDTO dto) {
        return null;
    }

    @PatchMapping("/{idLeitura}")
    public ResponseEntity<LeituraAmbienteResponse> atualizarLeituraParcial(
            @PathVariable Integer idLeito,
            @PathVariable Integer idLeitura,
            @RequestBody @Valid LeituraAmbientePatchDTO dto) {
        return null;
    }

    @DeleteMapping("/{idLeitura}")
    public ResponseEntity<Void> remover(
            @PathVariable Integer idLeito,
            @PathVariable Integer idLeitura) {
        return null;
    }
}
