package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.sensor.model.SensorPaciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SensorPacienteRepository extends JpaRepository<SensorPaciente, Integer> {
    List<SensorPaciente> findAllByIdPaciente(Integer idPaciente);
    Optional<SensorPaciente> findByIdPacienteAndIdSensor(Integer idPaciente, Integer idSensor);
}