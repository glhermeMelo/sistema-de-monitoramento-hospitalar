package br.edu.ufersa.smh.leito.repository;

import org.springframework.stereotype.Repository;

@Repository
public interface LeitoRepository extends JpaRepository<Leito, Integer> {
    List<Leito> findAllByStatusLeito(StatusLeito statusLeito);
    Optional<Leito> findByNumeroLeito(Integer numeroLeito);
    boolean existsByNumeroLeito(Integer numeroLeito);
}
