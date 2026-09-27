package br.edu.ufersa.smh.paciente;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.Nome;
import br.edu.ufersa.smh.leito.exception.LeitoOcupadoException;
import br.edu.ufersa.smh.leito.LeitoRepository;
import br.edu.ufersa.smh.paciente.dto.PacienteDTO;
import br.edu.ufersa.smh.paciente.dto.PacienteResponse;
import br.edu.ufersa.smh.paciente.exception.PacienteComSensoresException;
import br.edu.ufersa.smh.paciente.exception.PacienteJaCadastradoException;
import br.edu.ufersa.smh.paciente.exception.PacienteNaoEncontradoException;
import br.edu.ufersa.smh.sensor.SensorPacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
class PacienteService {
    private final PacienteRepository pacienteRepository;
    private final SensorPacienteRepository sensorPacienteRepository;
    private final LeitoRepository leitoRepository;

    @Transactional(readOnly = true)
    public List<PacienteResponse> listarPacientes(){
        return pacienteRepository
                .findAllByAtivoTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PacienteResponse buscarPaciente(Integer id){
        return toResponse(validarPaciente(id));
    }

    @Transactional
    public PacienteResponse cadastrarPaciente(PacienteDTO dto) {
        if (existePaciente(new Cpf(dto.cpf())))
            throw new PacienteJaCadastradoException("Paciente ja cadastrado: " + dto.nome());

        Paciente paciente = new Paciente(
                new Nome(dto.nome()),
                new Cpf(dto.cpf()),
                dto.dataNascimento()
        );

        return toResponse(pacienteRepository.save(paciente));
    }

    @Transactional
    public void deletarPaciente(Integer id) {
        Paciente paciente = validarPaciente(id);

        boolean leitoOcupado = leitoRepository.existsByPaciente_IdPaciente(id);
        if (leitoOcupado) {
            throw new LeitoOcupadoException("O paciente: " + id + " está ocupando um leito; desocupe-o antes de excluir");
        }

        boolean pacienteVinculado = sensorPacienteRepository.existsByIdPaciente(id);
        if (pacienteVinculado) {
            throw new PacienteComSensoresException("O paciente: " + id + " possui sensores conectados a ele, remova-os antes de excluir");
        }

        paciente.darAlta();
    }

    private boolean existePaciente(Cpf cpf) {
        return  pacienteRepository.existsByCpf(cpf);
    }

    private Paciente validarPaciente(Integer id) {
        return pacienteRepository.findByIdPaciente(id)
                .orElseThrow(() -> new PacienteNaoEncontradoException("Paciente: " + id + " não encontrado"));
    }

    private PacienteResponse toResponse(Paciente paciente) {
        return new PacienteResponse(
                paciente.getIdPaciente(),
                paciente.getNome().nome(),
                paciente.getDataNascimento()
        );
    }

    private Paciente toEntity(PacienteDTO dto) {
        return new Paciente(new Nome(dto.nome()), new Cpf(dto.cpf()), dto.dataNascimento());
    }
}
