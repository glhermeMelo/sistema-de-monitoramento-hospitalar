package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.leito.LeitoNaoEncontradoException;
import br.edu.ufersa.smh.leito.LeitoRepository;
import br.edu.ufersa.smh.sensor.dto.SensorAmbienteDTO;
import br.edu.ufersa.smh.sensor.dto.SensorAmbientePatchDTO;
import br.edu.ufersa.smh.sensor.dto.SensorAmbienteResponse;
import br.edu.ufersa.smh.sensor.model.SensorAmbiente;
import br.edu.ufersa.smh.sensor.model.TipoSensor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SensorAmbienteService {
    private final SensorAmbienteRepository sensorAmbienteRepository;
    private final LeitoRepository leitoRepository;

    @Transactional(readOnly = true)
    public List<SensorAmbienteResponse> listar(Integer idLeito) {
        validarLeito(idLeito);
        return sensorAmbienteRepository.findAllByIdLeito(idLeito)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SensorAmbienteResponse detalharSensorAmbiente(Integer idLeito, Integer idSensor) {
        return toResponse(buscarSensor(idLeito, idSensor));
    }

    @Transactional
    public SensorAmbienteResponse cadastrarSensorAmbiente(Integer idLeito, SensorAmbienteDTO dto) {
        validarLeito(idLeito);

        SensorAmbiente sensor = new SensorAmbiente(
                dto.intervaloLeitura(),
                TipoSensor.LEITO,
                idLeito,
                dto.pinosSdaScl(),
                dto.pinoAnalogico()
        );

        return toResponse(sensorAmbienteRepository.save(sensor));
    }

    @Transactional
    public SensorAmbienteResponse atualizarTotal(Integer idLeito, Integer idSensor, SensorAmbienteDTO dto) {
        validarLeito(idLeito);
        buscarSensor(idLeito, idSensor);

        SensorAmbiente sensor = new SensorAmbiente(
                idSensor,
                dto.intervaloLeitura(),
                TipoSensor.LEITO,
                idLeito,
                dto.pinosSdaScl(),
                dto.pinoAnalogico()
        );

        return toResponse(sensorAmbienteRepository.save(sensor));
    }

    @Transactional
    public SensorAmbienteResponse atualizarParcial(Integer idLeito, Integer idSensor, SensorAmbientePatchDTO dto) {
        validarLeito(idLeito);
        SensorAmbiente antes = buscarSensor(idLeito, idSensor);

        Integer intervaloLeitura = antes.getIntervaloLeitura();
        Integer pinosSdaScl = antes.getPinosSdaScl();
        Integer pinoAnalogico = antes.getPinoAnalogico();
        if (dto.intervaloLeitura() != null)
            intervaloLeitura = dto.intervaloLeitura();
        if (dto.pinosSdaScl() != null)
            pinosSdaScl = dto.pinosSdaScl();
        if (dto.pinoAnalogico() != null)
            pinoAnalogico = dto.pinoAnalogico();

        SensorAmbiente sensor = new SensorAmbiente(
                idSensor,
                intervaloLeitura,
                TipoSensor.LEITO,
                idLeito,
                pinosSdaScl,
                pinoAnalogico
        );

        return toResponse(sensorAmbienteRepository.save(sensor));
    }

    @Transactional
    public void deletarSensor(Integer idLeito, Integer idSensor) {
        validarLeito(idLeito);
        sensorAmbienteRepository.delete(buscarSensor(idLeito, idSensor));
    }

    private void validarLeito(Integer idLeito) {
        if (!leitoRepository.existsById(idLeito))
            throw new LeitoNaoEncontradoException("Leito " + idLeito + " não encontrado!");
    }

    private SensorAmbiente buscarSensor(Integer idLeito, Integer idSensor) {
        return sensorAmbienteRepository.findByIdLeitoAndIdSensor(idLeito, idSensor)
                .orElseThrow(() -> new SensorNaoEncontradoException("Sensor: " + idSensor + " não encontrado"));
    }

    private SensorAmbienteResponse toResponse(SensorAmbiente sensor) {
        return new SensorAmbienteResponse(
                sensor.getIdSensor(),
                sensor.getIdLeito(),
                sensor.getIntervaloLeitura(),
                sensor.getTipo(),
                sensor.getPinosSdaScl(),
                sensor.getPinoAnalogico());
    }
}
