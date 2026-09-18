package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.sensor.model.SensorAmbiente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
interface SensorAmbienteRepository extends JpaRepository<SensorAmbiente, Integer> {
    List<SensorAmbiente> findAllByIdLeito(Integer idLeito);
}