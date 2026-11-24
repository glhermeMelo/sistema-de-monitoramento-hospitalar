package br.edu.ufersa.smh.leitura;

import br.edu.ufersa.smh.leito.exception.LeitoNaoEncontradoException;
import br.edu.ufersa.smh.leito.LeitoRepository;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteResponse;
import br.edu.ufersa.smh.leitura.model.LeituraAmbiente;
import br.edu.ufersa.smh.sensor.SensorAmbienteRepository;
import br.edu.ufersa.smh.sensor.exception.SensorNaoEncontradoException;
import br.edu.ufersa.smh.sensor.model.SensorAmbiente;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeituraAmbienteService {
    private final LeituraAmbienteRepository repository;
    private final LeitoRepository leitoRepository;
    private final SensorAmbienteRepository sensorAmbienteRepository;

    @Transactional(readOnly = true)
    public List<LeituraAmbienteResponse> listarPorLeito(Integer numeroLeito) {
        validarLeito(numeroLeito);
        return repository.findAllByNumeroLeito(numeroLeito)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LeituraAmbienteResponse detalharLeituraAmbiente(Integer numeroLeito, Integer idLeitura) {
        LeituraAmbiente leitura = repository.findByNumeroLeitoAndIdLeitura(numeroLeito, idLeitura)
                .orElseThrow(() -> new LeituraNaoEncontradaException("Leitura: " + idLeitura + " não encontrada"));
        return toResponse(leitura);
    }

    //vai ser usado pelo coap
    @Transactional
    public LeituraAmbienteResponse cadastrarLeituraAmbiente(Integer numeroLeito, LeituraAmbienteDTO dto) {
        validarLeito(numeroLeito);
        validarSensor(numeroLeito, dto.idSensor());

        LeituraAmbiente leitura = toEntity(numeroLeito, dto);

        return toResponse(repository.save(leitura));
    }

    private void validarLeito(Integer numeroLeito) {
        if (!leitoRepository.existsById(numeroLeito))
            throw new LeitoNaoEncontradoException("Leito: " + numeroLeito + " não encontrado!");
    }

    private void validarSensor(Integer numeroLeito, Integer idSensor) {
        SensorAmbiente sensorAmbiente = sensorAmbienteRepository.findById(idSensor)
                .orElseThrow(() -> new SensorNaoEncontradoException("Sensor " + idSensor + " não encontrado!"));

        if (!sensorAmbiente.getNumeroLeito().equals(numeroLeito))
            throw new SensorNaoEncontradoException("O sensor " + idSensor + " não pertence ao leito: " + numeroLeito);
    }

    private LeituraAmbiente toEntity(Integer numeroLeito, LeituraAmbienteDTO dto) {
        return new LeituraAmbiente(
                dto.idSensor(),
                LocalDateTime.now(),
                numeroLeito,
                dto.temperaturaAmbiente(),
                dto.umidadeAmbiente(),
                dto.pressaoAmbiente(),
                dto.indiceTvoc(),
                dto.indiceEco2(),
                dto.nivelRuido(),
                dto.nivelLuminosidade());
    }

    private LeituraAmbienteResponse toResponse(LeituraAmbiente leituraAmbiente) {
        return new LeituraAmbienteResponse(
                leituraAmbiente.getIdLeitura(),
                leituraAmbiente.getIdSensor(),
                leituraAmbiente.getNumeroLeito(),
                leituraAmbiente.getDataLeitura(),
                leituraAmbiente.getTemperaturaAmbiente(),
                leituraAmbiente.getUmidadeAmbiente(),
                leituraAmbiente.getPressaoAmbiente(),
                leituraAmbiente.getIndiceTvoc(),
                leituraAmbiente.getIndiceEco2(),
                leituraAmbiente.getNivelRuido(),
                leituraAmbiente.getNivelLuminosidade()
        );
    }
}
