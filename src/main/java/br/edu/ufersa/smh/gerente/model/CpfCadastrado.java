package br.edu.ufersa.smh.gerente.model;

import java.time.LocalDateTime;

import br.edu.ufersa.smh.common.vo.Cpf;
import lombok.Getter;

@Getter
public class CpfCadastrado {
    private Cpf cpf;
    private CargoUsuario cargo;
    private LocalDateTime dataHabilitado;
    private IdGerente idGerente;
}