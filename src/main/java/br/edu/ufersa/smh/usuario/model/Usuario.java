package br.edu.ufersa.smh.usuario.model;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.IdUsuario;
import lombok.Getter;

@Getter
public class Usuario {
    private IdUsuario idUsuario;
    private String nome;
    private Cpf cpf;
    private String login;
    private String senha;
}