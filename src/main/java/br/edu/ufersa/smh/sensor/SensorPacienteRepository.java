package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.sensor.model.SensorPaciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorPacienteRepository extends JpaRepository<SensorPaciente, Integer> {
    List<SensorPaciente> findAllByIdPaciente(Integer idPaciente);
}