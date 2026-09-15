package br.edu.ufersa.smh.usuario.model;

import br.edu.ufersa.smh.common.vo.Cpf;
import lombok.Getter;

@Getter
public class Usuario {
    private String idUsuario;
    private String nome;
    private Cpf cpf;
    private String login;
    private String senha;
}