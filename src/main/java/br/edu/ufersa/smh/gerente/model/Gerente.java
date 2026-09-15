package br.edu.ufersa.smh.gerente.model;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.Login;
import br.edu.ufersa.smh.common.vo.Nome;
import br.edu.ufersa.smh.common.vo.Senha;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Validated
public class Gerente {
    @Id
    private Integer idGerente;
    @Valid private Nome nome;
    @Valid private Cpf cpf;
    @Valid private Login login;
    @Valid private Senha senha;
}