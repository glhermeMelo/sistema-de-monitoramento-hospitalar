package br.edu.ufersa.smh.coap;

import br.edu.ufersa.smh.leito.exception.LeitoNaoEncontradoException;
import br.edu.ufersa.smh.leitura.LeituraAmbienteService;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteDTO;
import br.edu.ufersa.smh.leitura.dto.LeituraAmbienteResponse;
import br.edu.ufersa.smh.sensor.SensorAmbienteRepository;
import br.edu.ufersa.smh.sensor.exception.SensorNaoEncontradoException;
import br.edu.ufersa.smh.sensor.model.SensorAmbiente;
import org.eclipse.californium.core.CoapResource;
import org.eclipse.californium.core.coap.CoAP;
import org.eclipse.californium.core.server.resources.CoapExchange;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
public class LeituraAmbienteCoapResource extends CoapResource {

    private final LeituraAmbienteService leituraAmbienteService;
    private final SensorAmbienteRepository sensorAmbienteRepository;
    private final ObjectMapper objectMapper;

    public LeituraAmbienteCoapResource(LeituraAmbienteService leituraAmbienteService,
                                       SensorAmbienteRepository sensorAmbienteRepository,
                                       ObjectMapper objectMapper) {
        super("ambiente");
        this.leituraAmbienteService = leituraAmbienteService;
        this.sensorAmbienteRepository = sensorAmbienteRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void handlePOST(CoapExchange exchange) {
        LeituraAmbienteDTO dto;
        try {
            dto = objectMapper.readValue(exchange.getRequestText(), LeituraAmbienteDTO.class);
        } catch (Exception e) {
            exchange.respond(CoAP.ResponseCode.BAD_REQUEST, "JSON inválido");
            return;
        }

        if (dto == null || dto.idSensor() == null) {
            exchange.respond(CoAP.ResponseCode.BAD_REQUEST, "campo obrigatório: idSensor");
            return;
        }

        try {
            SensorAmbiente sensor = sensorAmbienteRepository.findById(dto.idSensor())
                    .orElseThrow(() -> new SensorNaoEncontradoException("Sensor " + dto.idSensor() + " não encontrado!"));

            LeituraAmbienteResponse resposta = leituraAmbienteService
                    .cadastrarLeituraAmbiente(sensor.getNumeroLeito(), dto);

            exchange.respond(CoAP.ResponseCode.CREATED,
                    objectMapper.writeValueAsString(resposta));

        } catch (SensorNaoEncontradoException | LeitoNaoEncontradoException e) {
            exchange.respond(CoAP.ResponseCode.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            System.err.println("Falha ao processar leitura CoAP do sensor: " + e.getMessage());
            exchange.respond(CoAP.ResponseCode.INTERNAL_SERVER_ERROR, "erro interno");
        }
    }
}
