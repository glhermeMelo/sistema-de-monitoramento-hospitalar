package br.edu.ufersa.smh.usuario;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.ufersa.smh.usuario.dto.UsuarioDTO;
import br.edu.ufersa.smh.usuario.dto.UsuarioPatchDTO;
import br.edu.ufersa.smh.usuario.dto.UsuarioResponse;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RolesAllowed("ADMIN")
@RequestMapping("/api/v3/usuarios")
public class UsuarioController {
    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarUsuarios());
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> cadastrarUsuario(
            @RequestBody @Valid UsuarioDTO dto) {
        return ResponseEntity.created(
                URI.create("/api/v3/usuarios/" + dto.cpf()))
                .body(usuarioService.cadastrarUsuario(dto));
    }

    @GetMapping("/{cpf}")
    public ResponseEntity<UsuarioResponse> detalharUsuario(
            @PathVariable String cpf) {
        return ResponseEntity.ok(usuarioService.buscarUsuarioPorCpf(cpf));
    }

    @PatchMapping("/{cpf}")
    public ResponseEntity<UsuarioResponse> atualizarUsuario(
            @PathVariable String cpf,
            @RequestBody @Valid UsuarioPatchDTO dto) {
        return ResponseEntity.ok(usuarioService.atualizarUsuario(cpf, dto));
    }

    @DeleteMapping("/{cpf}")
    public ResponseEntity<Void> removerUsuario(
            @PathVariable String cpf) {
        usuarioService.deletarUsuarioPorCpf(cpf);
        return ResponseEntity.noContent().build();
    }
}