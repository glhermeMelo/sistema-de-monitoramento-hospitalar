package br.edu.ufersa.smh.sensor.repository;

import br.edu.ufersa.smh.sensor.model.SensorPaciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SensorPacienteRepository extends JpaRepository<SensorPaciente, String> {
    List<SensorPaciente> findAllByIdPaciente(String idPaciente);
}