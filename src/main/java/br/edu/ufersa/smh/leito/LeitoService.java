package br.edu.ufersa.smh.leito;

import br.edu.ufersa.smh.leito.dto.LeitoDTO;
import br.edu.ufersa.smh.leito.dto.LeitoPatchDTO;
import br.edu.ufersa.smh.leito.dto.LeitoResponse;
import br.edu.ufersa.smh.leito.exception.LeitoJaCadastradoException;
import br.edu.ufersa.smh.leito.exception.LeitoNaoEncontradoException;
import br.edu.ufersa.smh.leito.exception.LeitoOcupadoException;
import br.edu.ufersa.smh.leito.model.Leito;
import br.edu.ufersa.smh.leito.model.StatusLeito;
import br.edu.ufersa.smh.paciente.Paciente;
import br.edu.ufersa.smh.paciente.exception.PacienteNaoEncontradoException;
import br.edu.ufersa.smh.paciente.PacienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
class LeitoService {
    private final LeitoRepository leitoRepository;
    private final PacienteRepository pacienteRepository;

    @Transactional(readOnly = true)
    public List<LeitoResponse> listarLeitos() {
        return leitoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LeitoResponse detalharLeito(Integer numeroLeito) {
        return toResponse(validarLeito(numeroLeito));
    }

    @Transactional
    public LeitoResponse cadastrarLeito(LeitoDTO dto) {
        if (leitoRepository.existsByNumeroLeito(dto.numeroLeito()))
            throw new LeitoJaCadastradoException("Leito de número " + dto.numeroLeito() + " já cadastrado");

        Leito leito = new Leito(
                dto.numeroLeito(),
                dto.localizacao(),
                statusInicial(dto),
                pacienteDe(dto.idPaciente())
        );

        return toResponse(leitoRepository.save(leito));
    }

    @Transactional
    public LeitoResponse atualizarLeitoTotal(Integer numeroLeito, LeitoDTO dto) {
        validarLeito(numeroLeito);

        Leito leito = new Leito(
                numeroLeito,
                dto.localizacao(),
                statusInicial(dto),
                pacienteDe(dto.idPaciente())
        );

        return toResponse(leitoRepository.save(leito));
    }

    @Transactional
    public LeitoResponse atualizarLeitoParcial(Integer numeroLeito, LeitoPatchDTO dto) {
        Leito antes = validarLeito(numeroLeito);

        Leito leito = new Leito(
                numeroLeito,
                dto.localizacao() != null ? dto.localizacao() : antes.getLocalizacao(),
                dto.statusLeito() != null ? dto.statusLeito() : antes.getStatusLeito(),
                antes.getPaciente()
        );

        return toResponse(leitoRepository.save(leito));
    }

    @Transactional
    public void removerLeito(Integer numeroLeito) {
        Leito leito = validarLeito(numeroLeito);
        if (leito.getStatusLeito() == StatusLeito.OCUPADO)
            throw new LeitoOcupadoException("O leito está ocupado, desocupe-o antes");

        leitoRepository.delete(validarLeito(numeroLeito));
    }

    private Leito validarLeito(Integer numeroLeito) {
        return leitoRepository.findById(numeroLeito)
                .orElseThrow(() -> new LeitoNaoEncontradoException("Leito " + numeroLeito + " não encontrado"));
    }

    private StatusLeito statusInicial(LeitoDTO dto) {
        if (dto.idPaciente() != null)
            return StatusLeito.OCUPADO;
        return dto.statusLeito() != null ? dto.statusLeito() : StatusLeito.LIVRE;
    }

    private Paciente pacienteDe(Integer idPaciente) {
        if (idPaciente == null)
            return null;
        return pacienteRepository.findById(idPaciente)
                .orElseThrow(() -> new PacienteNaoEncontradoException("Paciente " + idPaciente + " não encontrado"));
    }

    private LeitoResponse toResponse(Leito leito) {
        return new LeitoResponse(
                leito.getNumeroLeito(),
                leito.getLocalizacao(),
                leito.getStatusLeito()
        );
    }
}
