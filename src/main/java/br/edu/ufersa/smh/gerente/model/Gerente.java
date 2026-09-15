package br.edu.ufersa.smh.gerente.model;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.IdGerente;
import lombok.Getter;

@Getter
public class Gerente {
    private IdGerente idGerente;
    private String nome;
    private Cpf cpf;
    private String login;
    private String senha;
}