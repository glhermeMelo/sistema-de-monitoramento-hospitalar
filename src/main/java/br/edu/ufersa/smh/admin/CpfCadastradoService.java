package br.edu.ufersa.smh.admin;

import br.edu.ufersa.smh.admin.dto.CpfCadastradoPatchDTO;
import br.edu.ufersa.smh.admin.model.CargoUsuario;
import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.admin.dto.CpfCadastradoDTO;
import br.edu.ufersa.smh.admin.dto.CpfCadastradoResponse;
import br.edu.ufersa.smh.admin.model.CpfCadastrado;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
            throw new CpfJaCadastradoException("CPF já cadastrado");

        CpfCadastrado cpfCadastrado = new CpfCadastrado(
                cpf, dto.cargo(), dto.dataLimiteHabilitado(), dto.idAdmin()
        );

        return toResponse(cpfCadastradoRepository.save(cpfCadastrado));
    }

    @Transactional
    public CpfCadastradoResponse detalharCpf(String cpf) {
        return toResponse(buscarCpf(cpf));
    }

    @Transactional
    public CpfCadastradoResponse atualizarCpf(String cpf, CpfCadastradoPatchDTO dto) {
        CpfCadastrado antes = buscarCpf(cpf);
        CargoUsuario cargo = antes.getCargo();
        LocalDate data = antes.getDataLimiteHabilitado();

        if (dto.cargo() != null)
            cargo = dto.cargo();

        if (dto.dataLimiteHabilitado() != null)
            data = dto.dataLimiteHabilitado();

        CpfCadastrado cpfCadastrado = new CpfCadastrado(
                antes.getCpf(),
                cargo,
                data,
                antes.getIdAdmin()
        );

        return toResponse(cpfCadastradoRepository.save(cpfCadastrado));
    }

    @Transactional
    public void removerCpf(String cpf) {
        cpfCadastradoRepository.delete(buscarCpf(cpf));
    }

    private CpfCadastrado buscarCpf(String cpf) {
        return cpfCadastradoRepository.findByCpf(new Cpf(cpf))
                .orElseThrow(() -> new CpfNaoEncontradoException("CPF não encontrado"));
    }

    private CpfCadastradoResponse toResponse(CpfCadastrado cpf) {
        return new CpfCadastradoResponse(
                cpf.getCpf().cpf(),
                cpf.getCargo(),
                cpf.getDataLimiteHabilitado(),
                cpf.getIdAdmin()
        );
    }
}
