package br.edu.ufersa.smh.admin;

import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.admin.dto.CpfCadastradoDTO;
import br.edu.ufersa.smh.admin.dto.CpfCadastradoResponse;
import br.edu.ufersa.smh.admin.model.CpfCadastrado;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
class CpfCadastradoService {
    private final CpfCadastradoRepository cpfCadastradoRepository;

    @Transactional
    public List<CpfCadastradoResponse> listarMembros() {
        return cpfCadastradoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CpfCadastradoResponse cadastrarCpf(CpfCadastradoDTO dto) {
        Cpf cpf = new Cpf(dto.cpf());

        if (cpfCadastradoRepository.existsByCpf(cpf))
            throw new CpfCadastradoException("CPF já cadastrado");

        CpfCadastrado cpfCadastrado = new CpfCadastrado(
                cpf, dto.cargo(), LocalDateTime.now(), dto.idAdmin()
        );

        return toResponse(cpfCadastradoRepository.save(cpfCadastrado));
    }

    @Transactional
    public CpfCadastradoResponse detalharCpf(String cpf) {
        return toResponse(buscarCpf(cpf));
    }

    @Transactional
    public CpfCadastradoResponse atualizarCpfTotal(CpfCadastradoDTO dto) {
        return null;
    }

    private CpfCadastrado buscarCpf(String cpf) {
        return cpfCadastradoRepository.findByCpf(new Cpf(cpf))
                .orElseThrow(() -> new CpfCadastradoException("CPF não encontrado"));
    }

    private CpfCadastradoResponse toResponse(CpfCadastrado cpf) {
        return new CpfCadastradoResponse(
                cpf.getCpf().cpf(),
                cpf.getCargo(),
                cpf.getDataHabilitado(),
                cpf.getIdAdmin()
        );
    }
}
