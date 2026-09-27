package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.leito.exception.LeitoNaoEncontradoException;
import br.edu.ufersa.smh.leito.LeitoRepository;
import br.edu.ufersa.smh.sensor.dto.SensorAmbienteDTO;
import br.edu.ufersa.smh.sensor.dto.SensorAmbientePatchDTO;
import br.edu.ufersa.smh.sensor.dto.SensorAmbienteResponse;
import br.edu.ufersa.smh.sensor.exception.SensorNaoEncontradoException;
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
    public List<SensorAmbienteResponse> listar(Integer numeroLeito) {
        validarLeito(numeroLeito);
        return sensorAmbienteRepository.findAllByNumeroLeito(numeroLeito)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SensorAmbienteResponse detalharSensorAmbiente(Integer numeroLeito, Integer idSensor) {
        return toResponse(buscarSensor(numeroLeito, idSensor));
    }

    @Transactional
    public SensorAmbienteResponse cadastrarSensorAmbiente(Integer numeroLeito, SensorAmbienteDTO dto) {
        validarLeito(numeroLeito);

        SensorAmbiente sensor = new SensorAmbiente(
                dto.intervaloLeitura(),
                TipoSensor.LEITO,
                numeroLeito,
                dto.pinosSdaScl(),
                dto.pinoAnalogico()
        );

        return toResponse(sensorAmbienteRepository.save(sensor));
    }

    @Transactional
    public SensorAmbienteResponse atualizarTotal(Integer numeroLeito, Integer idSensor, SensorAmbienteDTO dto) {
        validarLeito(numeroLeito);
        buscarSensor(numeroLeito, idSensor);

        SensorAmbiente sensor = new SensorAmbiente(
                idSensor,
                dto.intervaloLeitura(),
                TipoSensor.LEITO,
                numeroLeito,
                dto.pinosSdaScl(),
                dto.pinoAnalogico()
        );

        return toResponse(sensorAmbienteRepository.save(sensor));
    }

    @Transactional
    public SensorAmbienteResponse atualizarParcial(Integer numeroLeito, Integer idSensor, SensorAmbientePatchDTO dto) {
        validarLeito(numeroLeito);
        SensorAmbiente antes = buscarSensor(numeroLeito, idSensor);

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
                numeroLeito,
                pinosSdaScl,
                pinoAnalogico
        );

        return toResponse(sensorAmbienteRepository.save(sensor));
    }

    @Transactional
    public void deletarSensor(Integer numeroLeito, Integer idSensor) {
        validarLeito(numeroLeito);
        sensorAmbienteRepository.delete(buscarSensor(numeroLeito, idSensor));
    }

    private void validarLeito(Integer numeroLeito) {
        if (!leitoRepository.existsById(numeroLeito))
            throw new LeitoNaoEncontradoException("Leito " + numeroLeito + " não encontrado!");
    }

    private SensorAmbiente buscarSensor(Integer numeroLeito, Integer idSensor) {
        return sensorAmbienteRepository.findByNumeroLeitoAndIdSensor(numeroLeito, idSensor)
                .orElseThrow(() -> new SensorNaoEncontradoException("Sensor: " + idSensor + " não encontrado"));
    }

    private SensorAmbienteResponse toResponse(SensorAmbiente sensor) {
        return new SensorAmbienteResponse(
                sensor.getIdSensor(),
                sensor.getNumeroLeito(),
                sensor.getIntervaloLeitura(),
                sensor.getTipo(),
                sensor.getPinosSdaScl(),
                sensor.getPinoAnalogico());
    }
}
