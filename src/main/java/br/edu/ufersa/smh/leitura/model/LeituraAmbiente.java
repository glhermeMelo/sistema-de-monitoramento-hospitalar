package br.edu.ufersa.smh.leitura.model;

import java.time.LocalDateTime;

import br.edu.ufersa.smh.leito.model.Leito;
import br.edu.ufersa.smh.sensor.model.SensorAmbiente;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "leitura_ambiente")
@Getter
public class LeituraAmbiente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_leitura")
    private Integer idLeitura;


    @Column(name = "data_leitura", nullable = false)
    private LocalDateTime dataLeitura;

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