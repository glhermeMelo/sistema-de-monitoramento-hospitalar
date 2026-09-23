package br.edu.ufersa.smh.gerente.model;

import java.time.LocalDateTime;

import br.edu.ufersa.smh.common.vo.Cpf;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "cpf_cadastrado")
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class CpfCadastrado {
    @EmbeddedId
    private Cpf cpf;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "cargo", nullable = false)
    private CargoUsuario cargo;

    @Column(name = "data_habilitado", nullable = false)
    private LocalDateTime dataHabilitado;

    @Column(name = "id_gerente", nullable = false)
    private Integer idGerente;
}