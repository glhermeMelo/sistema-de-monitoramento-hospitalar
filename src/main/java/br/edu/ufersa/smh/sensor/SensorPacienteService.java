package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.paciente.PacienteNaoEncontradoException;
import br.edu.ufersa.smh.paciente.PacienteRepository;
import br.edu.ufersa.smh.sensor.dto.SensorPacienteDTO;
import br.edu.ufersa.smh.sensor.dto.SensorPacientePatchDTO;
import br.edu.ufersa.smh.sensor.dto.SensorPacienteResponse;
import br.edu.ufersa.smh.sensor.model.SensorPaciente;
import br.edu.ufersa.smh.sensor.model.TipoSensor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SensorPacienteService {
    private final SensorPacienteRepository sensorPacienteRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional(readOnly = true)
    public List<SensorPacienteResponse> listar(Integer idPaciente) {
        validarPaciente(idPaciente);
        return sensorPacienteRepository.findAllByIdPaciente(idPaciente)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SensorPacienteResponse detalharSensorPaciente(Integer idPaciente, Integer idSensor) {
        return toResponse(buscarSensor(idPaciente, idSensor));
    }

    @Transactional
    public SensorPacienteResponse cadastrarSensorPaciente(Integer idPaciente, SensorPacienteDTO dto) {
        validarPaciente(idPaciente);

        SensorPaciente sensor = new SensorPaciente(
                dto.intervaloLeitura(),
                TipoSensor.PACIENTE,
                idPaciente,
                dto.pinosI2c(),
                dto.pinosOneWire()
        );

        return toResponse(sensorPacienteRepository.save(sensor));
    }

    @Transactional
    public SensorPacienteResponse atualizarTotal(Integer idPaciente, Integer idSensor, SensorPacienteDTO dto) {
        validarPaciente(idPaciente);
        SensorPaciente antes = buscarSensor(idPaciente, idSensor);
        SensorPaciente sensor = new SensorPaciente(
                idSensor,
                dto.intervaloLeitura(),
                TipoSensor.PACIENTE,
                idPaciente,
                dto.pinosI2c(),
                dto.pinosOneWire()
        );

        return toResponse(sensorPacienteRepository.save(sensor));
    }

    @Transactional
    public SensorPacienteResponse atualizarParcial(Integer idPaciente, Integer idSensor,  SensorPacientePatchDTO dto) {
        validarPaciente(idPaciente);
        SensorPaciente antes = buscarSensor(idPaciente, idSensor);
        Integer intervaloLeitura = antes.getIntervaloLeitura();
        Integer pinosI2c = antes.getPinosI2c();
        Integer pinosOneWire =  antes.getPinosOneWire();
        if (dto.intervaloLeitura() != null)
            intervaloLeitura = dto.intervaloLeitura();
        if (dto.pinosI2c() != null)
            pinosI2c = dto.pinosI2c();
        if (dto.pinosOneWire() != null)
            pinosOneWire = dto.pinosOneWire();

        SensorPaciente sensor = new SensorPaciente(
                idSensor,
                intervaloLeitura,
                TipoSensor.PACIENTE,
                idPaciente,
                pinosI2c,
                pinosOneWire
        );

        return  toResponse(sensorPacienteRepository.save(sensor));
    }

    @Transactional
    public void deletarSensor(Integer idPaciente, Integer idSensor) {
        validarPaciente(idPaciente);
        sensorPacienteRepository.delete(buscarSensor(idPaciente, idSensor));
    }

    private void validarPaciente(Integer idPaciente) {
        if (!pacienteRepository.existsById(idPaciente))
            throw new PacienteNaoEncontradoException("Paciente " + idPaciente + " não encontrado!");
    }

    private SensorPaciente buscarSensor(Integer idPaciente, Integer idSensor) {
        return sensorPacienteRepository.findByIdPacienteAndIdSensor(idPaciente, idSensor)
                .orElseThrow(() -> new SensorNaoEncontradoException("Sensor: " + idSensor + " não encontrado"));
    }

    private SensorPacienteResponse toResponse(SensorPaciente sensor) {
        return new SensorPacienteResponse(
                sensor.getIdSensor(),
                sensor.getIdPaciente(),
                sensor.getIntervaloLeitura(),
                sensor.getTipo(),
                sensor.getPinosI2c(),
                sensor.getPinosOneWire());
    }
}
