package br.edu.ufersa.smh.paciente.model;

import java.time.LocalDate;

import br.edu.ufersa.smh.common.vo.Cpf;
import lombok.Getter;

@Getter
public class Paciente {
    private IdPaciente idPaciente;
    private String nomeCompleto;
    private Cpf cpf;
    private LocalDate dataNascimento;
}