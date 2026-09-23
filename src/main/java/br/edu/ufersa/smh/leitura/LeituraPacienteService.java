package br.edu.ufersa.smh.leitura;

import br.edu.ufersa.smh.leitura.dto.LeituraPacienteDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraPacienteResponse;
import br.edu.ufersa.smh.leitura.model.LeituraPaciente;
import br.edu.ufersa.smh.paciente.PacienteNaoEncontradoException;
import br.edu.ufersa.smh.paciente.PacienteRepository;
import br.edu.ufersa.smh.sensor.SensorNaoEncontradoException;
import br.edu.ufersa.smh.sensor.SensorPacienteRepository;
import br.edu.ufersa.smh.sensor.model.SensorPaciente;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
class LeituraPacienteService {
    private final LeituraPacienteRepository leituraPacienteRepository;
    private final SensorPacienteRepository sensorPacienteRepository;
    private final PacienteRepository pacienteRepository;

    public List<LeituraPacienteResponse> listarPorPaciente(Integer idPaciente) {
        validarPaciente(idPaciente);
        return leituraPacienteRepository.findAllByIdPaciente(idPaciente)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public LeituraPacienteResponse cadastrar(
            Integer idPaciente,
            LeituraPacienteDTO dto) {
        validarPaciente(idPaciente);
        validarSensor(idPaciente, dto.idSensor());

        LeituraPaciente leitura = new LeituraPaciente(idPaciente, dto.temperaturaCorporal(), dto.spo2(), dto.bpm());
        leitura.setIdSensor(dto.idSensor());
        leitura.setDataLeitura(LocalDateTime.now());

        return toResponse(leituraPacienteRepository.save(leitura));
    }

    private void validarPaciente(Integer idPaciente) {
        if (!leituraPacienteRepository.existsById(idPaciente)) {
            throw new PacienteNaoEncontradoException("Paciente " + idPaciente + " não encontrado!");
        }
    }

    private void validarSensor(Integer idPaciente, Integer idSensor) {
        SensorPaciente sensor = sensorPacienteRepository.findById(idPaciente)
                .orElseThrow(() -> new SensorNaoEncontradoException("Sensor " + idSensor + " não encontrado!"));

        if(!sensor.getIdPaciente().equals(idPaciente)) {
            throw new SensorNaoEncontradoException( "O sensor " + idSensor + " não pertence ao paciente " + idPaciente);
        }
    }

    private LeituraPacienteResponse toResponse(LeituraPaciente leitura) {
        return new LeituraPacienteResponse(
                leitura.getIdLeitura(),
                leitura.getIdSensor(),
                leitura.getIdPaciente(),
                leitura.getDataLeitura(),
                leitura.getTemperaturaCorporal(),
                leitura.getSpo2(),
                leitura.getBpm());
    }
}
