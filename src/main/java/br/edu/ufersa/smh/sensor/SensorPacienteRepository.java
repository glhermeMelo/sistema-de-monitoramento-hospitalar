package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.sensor.model.SensorPaciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SensorPacienteRepository extends JpaRepository<SensorPaciente, Integer> {
    List<SensorPaciente> findAllByIdPaciente(Integer idPaciente);
}