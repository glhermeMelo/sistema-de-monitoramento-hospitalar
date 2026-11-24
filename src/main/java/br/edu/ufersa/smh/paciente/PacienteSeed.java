package br.edu.ufersa.smh.paciente;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.Nome;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@Order(2)
public class PacienteSeed implements CommandLineRunner {

    private static final String NOME_PACIENTE = "Paciente Teste";
    private static final String CPF_PACIENTE = "11144477735";
    private static final LocalDate NASCIMENTO_PACIENTE = LocalDate.of(1990, 1, 1);

    private final PacienteRepository pacienteRepository;

    public PacienteSeed(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @Override
    public void run(String... args) {
        if (pacienteRepository.count() > 0) return;

        Paciente paciente = pacienteRepository.save(
                new Paciente(new Nome(NOME_PACIENTE), new Cpf(CPF_PACIENTE), NASCIMENTO_PACIENTE));

        System.out.println("[SEED] Paciente teste criado: idPaciente=" + paciente.getIdPaciente()
                + " (" + NOME_PACIENTE + ")");
    }
}
