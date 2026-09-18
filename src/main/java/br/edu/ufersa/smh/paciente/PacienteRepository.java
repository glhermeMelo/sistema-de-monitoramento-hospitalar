package br.edu.ufersa.smh.paciente;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface PacienteRepository extends JpaRepository<Paciente, Integer> {
}