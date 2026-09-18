package br.edu.ufersa.smh.leito;

import br.edu.ufersa.smh.leito.model.Leito;
import br.edu.ufersa.smh.leito.model.StatusLeito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
interface LeitoRepository extends JpaRepository<Leito, Integer> {
    List<Leito> findAllByStatusLeito(StatusLeito statusLeito);
    Optional<Leito> findByNumeroLeito(Integer numeroLeito);
    boolean existsByNumeroLeito(Integer numeroLeito);
}
