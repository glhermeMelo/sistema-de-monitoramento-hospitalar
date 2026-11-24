package br.edu.ufersa.smh.coap;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import org.eclipse.californium.core.CoapResource;
import org.eclipse.californium.core.CoapServer;
import org.eclipse.californium.core.coap.CoAP;
import org.eclipse.californium.core.config.CoapConfig;
import org.eclipse.californium.core.server.resources.CoapExchange;
import org.eclipse.californium.elements.config.UdpConfig;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class CoapServerConfig {

    private final ObjectProvider<CoapResource> recursos;

    @Value("${COAP_PORTA:5683}")
    private int porta;

    @Value("${COAP_NOME_SERVIDOR:smh-coap}")
    private String nomeServidor;

    private CoapServer servidor;

    @PostConstruct
    public void iniciarServidor() {
        CoapConfig.register();
        UdpConfig.register();

        servidor = new CoapServer(porta);
        servidor.setTag(nomeServidor);

        CoapResource leituras = new CoapResource("leituras") {
            @Override
            public void handlePOST(CoapExchange exchange) {
                exchange.respond(CoAP.ResponseCode.BAD_REQUEST, "Use POST /leituras/ambiente ou /leituras/paciente");
            }
        };

        recursos.orderedStream().forEach(leituras::add);

        servidor.add(leituras);
        servidor.start();

        System.out.println("Servidor CoAP " + nomeServidor + " iniciado na porta " + porta);
    }

    @PreDestroy
    public void pararServidor() {
        if (servidor != null) {
            servidor.stop();
            System.out.println("Servidor " + nomeServidor + " encerrado");
        }
    }
}