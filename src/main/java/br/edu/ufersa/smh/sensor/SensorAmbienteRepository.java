package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.sensor.model.SensorAmbiente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SensorAmbienteRepository extends JpaRepository<SensorAmbiente, Integer> {
    List<SensorAmbiente> findAllByIdLeito(Integer idLeito);
}