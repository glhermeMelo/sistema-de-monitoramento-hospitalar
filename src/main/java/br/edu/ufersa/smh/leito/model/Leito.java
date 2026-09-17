package br.edu.ufersa.smh.leito.model;

import br.edu.ufersa.smh.paciente.Paciente;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Objects;

@Entity
@Table(name = "leito")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Leito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_leito")
    private Integer idLeito;

    @Column(name = "numero_leito", nullable = false, unique = true)
    private Integer numeroLeito;

    @Column(name = "localizacao", nullable = false, length = 100)
    private String localizacao;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status_leito", nullable = false)
    private StatusLeito statusLeito;

    @OneToOne
    @JoinColumn(name = "id_paciente")
    private Paciente paciente;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Leito leito = (Leito) o;
        return Objects.equals(numeroLeito, leito.numeroLeito);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(numeroLeito);
    }
}