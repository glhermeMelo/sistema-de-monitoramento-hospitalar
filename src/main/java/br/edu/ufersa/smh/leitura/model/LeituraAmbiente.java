package br.edu.ufersa.smh.leitura.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "leitura_ambiente")
@PrimaryKeyJoinColumn(name = "id_leitura")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LeituraAmbiente extends Leitura {
    @Column(name = "id_leito", nullable = false)
    private Integer idLeito;

    @Column(name = "temperatura_ambiente")
    private Float temperaturaAmbiente;

    @Column(name = "umidade_ambiente")
    private Float umidadeAmbiente;

    @Column(name = "pressao_ambiente")
    private Float pressaoAmbiente;

    @Column(name = "indice_tvoc")
    private Integer indiceTvoc;

    @Column(name = "indice_eco2")
    private Integer indiceEco2;

    @Column(name = "nivel_ruido")
    private Float nivelRuido;

    @Column(name = "nivel_luminosidade")
    private Float nivelLuminosidade;
}