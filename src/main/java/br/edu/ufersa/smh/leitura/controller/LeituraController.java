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

import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbientePatchDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteResponse;
import br.edu.ufersa.smh.leitura.dto.LeituraPacienteDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraPacientePatchDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraPacienteResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/leituras")
public class LeituraController {

    @GetMapping("/paciente")
    public ResponseEntity<List<LeituraPacienteResponse>> listarLeiturasPaciente() {
        return null;
    }

    @GetMapping("/paciente/{idLeitura}")
    public ResponseEntity<LeituraPacienteResponse> detalharLeituraPaciente(
            @PathVariable Integer idLeitura) {
        return null;
    }

    @PostMapping("/paciente")
    public ResponseEntity<LeituraPacienteResponse> cadastrarLeituraPaciente(
            @RequestBody LeituraPacienteDTO dto) {
        return null;
    }

    @PutMapping("/paciente/{idLeitura}")
    public ResponseEntity<LeituraPacienteResponse> atualizarLeituraPacienteTotal(
            @PathVariable Integer idLeitura,
            @RequestBody LeituraPacienteDTO dto) {
        return null;
    }

    @PatchMapping("/paciente/{idLeitura}")
    public ResponseEntity<LeituraPacienteResponse> atualizarLeituraPacienteParcial(
            @PathVariable Integer idLeitura,
            @RequestBody LeituraPacientePatchDTO dto) {
        return null;
    }

    @DeleteMapping("/paciente/{idLeitura}")
    public ResponseEntity<Void> deletarLeituraPaciente(
            @PathVariable Integer idLeitura) {
        return null;
    }

    @GetMapping("/ambiente")
    public ResponseEntity<List<LeituraAmbienteResponse>> listarLeiturasAmbiente() {
        return null;
    }

    @GetMapping("/ambiente/{idLeitura}")
    public ResponseEntity<LeituraAmbienteResponse> detalharLeituraAmbiente(
            @PathVariable Integer idLeitura) {
        return null;
    }

    @PostMapping("/ambiente")
    public ResponseEntity<LeituraAmbienteResponse> cadastrarLeituraAmbiente(
            @RequestBody LeituraAmbienteDTO dto) {
        return null;
    }

    @PutMapping("/ambiente/{idLeitura}")
    public ResponseEntity<LeituraAmbienteResponse> atualizarLeituraAmbienteTotal(
            @PathVariable Integer idLeitura,
            @RequestBody LeituraAmbienteDTO dto) {
        return null;
    }

    @PatchMapping("/ambiente/{idLeitura}")
    public ResponseEntity<LeituraAmbienteResponse> atualizarLeituraAmbienteParcial(
            @PathVariable Integer idLeitura,
            @RequestBody LeituraAmbientePatchDTO dto) {
        return null;
    }

    @DeleteMapping("/ambiente/{idLeitura}")
    public ResponseEntity<Void> deletarLeituraAmbiente(
            @PathVariable Integer idLeitura) {
        return null;
    }
}