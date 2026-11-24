package br.edu.ufersa.smh.sensor;

import br.edu.ufersa.smh.leito.LeitoRepository;
import br.edu.ufersa.smh.paciente.Paciente;
import br.edu.ufersa.smh.paciente.PacienteRepository;
import br.edu.ufersa.smh.sensor.model.SensorAmbiente;
import br.edu.ufersa.smh.sensor.model.SensorPaciente;
import br.edu.ufersa.smh.sensor.model.TipoSensor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(3)
public class SensorSeed implements CommandLineRunner {

    private static final Integer NUMERO_LEITO = 1;
    private static final Integer INTERVALO_AMBIENTE_MS = 2000;
    private static final Integer INTERVALO_PACIENTE_MS = 1000;

    private final LeitoRepository leitoRepository;
    private final PacienteRepository pacienteRepository;
    private final SensorAmbienteRepository sensorAmbienteRepository;
    private final SensorPacienteRepository sensorPacienteRepository;

    public SensorSeed(LeitoRepository leitoRepository,
                      PacienteRepository pacienteRepository,
                      SensorAmbienteRepository sensorAmbienteRepository,
                      SensorPacienteRepository sensorPacienteRepository) {
        this.leitoRepository = leitoRepository;
        this.pacienteRepository = pacienteRepository;
        this.sensorAmbienteRepository = sensorAmbienteRepository;
        this.sensorPacienteRepository = sensorPacienteRepository;
    }

    @Override
    public void run(String... args) {
        seedSensorAmbiente();
        seedSensorPaciente();
    }

    private void seedSensorAmbiente() {
        if (sensorAmbienteRepository.count() > 0) return;

        if (!leitoRepository.existsById(NUMERO_LEITO)) {
            System.out.println("[SEED] Sensor ambiente não criado: leito " + NUMERO_LEITO + " ausente");
            return;
        }

        SensorAmbiente sensor = sensorAmbienteRepository.save(
                new SensorAmbiente(INTERVALO_AMBIENTE_MS, TipoSensor.LEITO, NUMERO_LEITO, 21, 34));

        System.out.println("[SEED] Sensor ambiente criado: idSensor=" + sensor.getIdSensor()
                + " -> leito " + NUMERO_LEITO);
    }

    private void seedSensorPaciente() {
        if (sensorPacienteRepository.count() > 0) return;

        Paciente paciente = pacienteRepository.findAll().stream().findFirst().orElse(null);
        if (paciente == null) {
            System.out.println("[SEED] Sensor paciente não criado: nenhum paciente cadastrado");
            return;
        }

        SensorPaciente sensor = sensorPacienteRepository.save(
                new SensorPaciente(INTERVALO_PACIENTE_MS, TipoSensor.PACIENTE, paciente.getIdPaciente(), 21, 27));

        System.out.println("[SEED] Sensor paciente criado: idSensor=" + sensor.getIdSensor()
                + " -> paciente " + paciente.getIdPaciente());
    }
}
