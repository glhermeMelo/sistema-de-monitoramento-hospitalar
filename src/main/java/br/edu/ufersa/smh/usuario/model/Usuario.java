package br.edu.ufersa.smh.usuario.model;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.Login;
import br.edu.ufersa.smh.common.vo.Nome;
import br.edu.ufersa.smh.common.vo.Senha;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Entity
@Table(name = "usuario")
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;

    @Embedded
    @Valid
    @Column(name = "nome", nullable = false)
    private Nome nome;

    @Embedded
    @Valid
    @Column(name = "cpf", nullable = false, unique = true)
    private Cpf cpf;

    @Embedded
    @Valid
    @Column(name = "login", nullable = false, unique = true)
    private Login login;

    @Embedded
    @Valid
    @Column(name = "senha", nullable = false)
    private Senha senha;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return Objects.equals(cpf, usuario.cpf);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(cpf);
    }
}
