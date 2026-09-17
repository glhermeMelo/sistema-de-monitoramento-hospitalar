package br.edu.ufersa.smh.sensor.repository;

import br.edu.ufersa.smh.sensor.model.SensorAmbiente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SensorAmbienteRepository extends JpaRepository<SensorAmbiente, String> {
    List<SensorAmbiente> findAllByIdLeito(String idLeito);
}