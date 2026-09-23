package br.edu.ufersa.smh.leitura;

import br.edu.ufersa.smh.leito.LeitoNaoEncontradoException;
import br.edu.ufersa.smh.leito.LeitoRepository;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteResponse;
import br.edu.ufersa.smh.leitura.model.LeituraAmbiente;
import br.edu.ufersa.smh.sensor.SensorAmbienteRepository;
import br.edu.ufersa.smh.sensor.SensorNaoEncontradoException;
import br.edu.ufersa.smh.sensor.model.SensorAmbiente;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
class LeituraAmbienteService {
    private final LeituraAmbienteRepository repository;
    private final LeitoRepository leitoRepository;
    private final SensorAmbienteRepository sensorAmbienteRepository;

    @Transactional(readOnly = true)
    public List<LeituraAmbienteResponse> listarPorLeito(Integer idLeito) {
        validarLeito(idLeito);
        return repository.findAllByIdLeito(idLeito)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LeituraAmbienteResponse detalharLeituraAmbiente(Integer idLeito, Integer idLeitura) {
        LeituraAmbiente leitura = repository.findByIdLeitoAndIdLeitura(idLeito, idLeitura)
                .orElseThrow(() -> new LeituraNaoEncontradaException("Leitura: " + idLeitura + " não encontrada"));
        return toResponse(leitura);
    }

    //vai ser usado pelo coap
    @Transactional
    public LeituraAmbienteResponse cadastrarLeituraAmbiente(Integer idLeito, LeituraAmbienteDTO dto) {
        validarLeito(idLeito);
        validarSensor(idLeito, dto.idSensor());

        LeituraAmbiente leitura = toEntity(idLeito, dto);
        leitura.setIdSensor(dto.idSensor());
        leitura.setDataLeitura(LocalDateTime.now());

        return toResponse(repository.save(leitura));
    }

    private void validarLeito(Integer idLeito) {
        if (!leitoRepository.existsById(idLeito))
            throw new LeitoNaoEncontradoException("Leito: " + idLeito + " não encontrado!");
    }

    private void validarSensor(Integer idLeito, Integer idSensor) {
        SensorAmbiente sensorAmbiente = sensorAmbienteRepository.findById(idSensor)
                .orElseThrow(() -> new SensorNaoEncontradoException("Sensor " + idSensor + " não encontrado!"));

        if (!sensorAmbiente.getIdLeito().equals(idLeito))
            throw new SensorNaoEncontradoException("O sensor " + idSensor + " não pertence ao leito: " + idLeito);
    }

    private LeituraAmbiente toEntity(Integer idLeito, LeituraAmbienteDTO dto) {
        return new LeituraAmbiente(
                idLeito,
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
                leituraAmbiente.getIdLeito(),
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
