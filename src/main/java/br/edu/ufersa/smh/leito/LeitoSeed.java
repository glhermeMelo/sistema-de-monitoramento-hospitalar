package br.edu.ufersa.smh.leito;

import br.edu.ufersa.smh.leito.model.Leito;
import br.edu.ufersa.smh.leito.model.StatusLeito;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class LeitoSeed implements CommandLineRunner {

    private static final Integer NUMERO_LEITO = 1;
    private static final String LOCALIZACAO_LEITO = "Quarto 101";

    private final LeitoRepository leitoRepository;

    public LeitoSeed(LeitoRepository leitoRepository) {
        this.leitoRepository = leitoRepository;
    }

    @Override
    public void run(String... args) {
        if (leitoRepository.existsById(NUMERO_LEITO)) return;

        leitoRepository.save(new Leito(NUMERO_LEITO, LOCALIZACAO_LEITO, StatusLeito.LIVRE, null));
        System.out.println("[SEED] Leito " + NUMERO_LEITO + " criado (" + LOCALIZACAO_LEITO + ")");
    }
}
