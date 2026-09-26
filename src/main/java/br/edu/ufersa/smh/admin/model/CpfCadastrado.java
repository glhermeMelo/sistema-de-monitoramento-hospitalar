package br.edu.ufersa.smh.admin.model;

import java.time.LocalDate;

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
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CpfCadastrado {
    @EmbeddedId
    private Cpf cpf;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "cargo", nullable = false)
    private CargoUsuario cargo;

    @Column(name = "data_limite_habilitado", nullable = false)
    private LocalDate dataLimiteHabilitado;

    @Column(name = "id_admin", nullable = false)
    private Integer idAdmin;

    public CpfCadastrado(CargoUsuario cargo, LocalDate dataLimiteHabilitado) {
        this.cargo = cargo;
        this.dataLimiteHabilitado = dataLimiteHabilitado;
    }
}