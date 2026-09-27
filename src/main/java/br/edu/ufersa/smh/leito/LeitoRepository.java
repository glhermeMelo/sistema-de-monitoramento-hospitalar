package br.edu.ufersa.smh.leito;

import br.edu.ufersa.smh.leito.model.Leito;
import br.edu.ufersa.smh.leito.model.StatusLeito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeitoRepository extends JpaRepository<Leito, Integer> {
    List<Leito> findAllByStatusLeito(StatusLeito statusLeito);
    boolean existsByNumeroLeito(Integer numeroLeito);
    boolean existsByPaciente_IdPaciente(Integer idPaciente);
}
