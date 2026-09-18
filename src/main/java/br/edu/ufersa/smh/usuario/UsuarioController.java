package br.edu.ufersa.smh.usuario;

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

import br.edu.ufersa.smh.usuario.dto.UsuarioDTO;
import br.edu.ufersa.smh.usuario.dto.UsuarioPatchDTO;
import br.edu.ufersa.smh.usuario.dto.UsuarioResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        return null;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> cadastrarUsuario(
            @RequestBody UsuarioDTO dto) {
        return null;
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<UsuarioResponse> detalharUsuario(
            @PathVariable Integer idUsuario) {
        return null;
    }

    @PutMapping("/{idUsuario}")
    public ResponseEntity<UsuarioResponse> atualizarUsuarioTotal(
            @PathVariable Integer idUsuario,
            @RequestBody UsuarioDTO dto) {
        return null;
    }

    @PatchMapping("/{idUsuario}")
    public ResponseEntity<UsuarioResponse> atualizarUsuarioParcial(
            @PathVariable Integer idUsuario,
            @RequestBody UsuarioPatchDTO dto) {
        return null;
    }

    @DeleteMapping("/{idUsuario}")
    public ResponseEntity<Void> removerUsuario(
            @PathVariable Integer idUsuario) {
        return null;
    }
}