package br.edu.ufersa.smh.common.exception;

import br.edu.ufersa.smh.admin.exception.CpfJaCadastradoException;
import br.edu.ufersa.smh.admin.exception.CpfNaoEncontradoException;
import br.edu.ufersa.smh.leito.exception.LeitoJaCadastradoException;
import br.edu.ufersa.smh.leito.exception.LeitoNaoEncontradoException;
import br.edu.ufersa.smh.leito.exception.LeitoOcupadoException;
import br.edu.ufersa.smh.leitura.LeituraNaoEncontradaException;
import br.edu.ufersa.smh.paciente.exception.PacienteComSensoresException;
import br.edu.ufersa.smh.paciente.exception.PacienteJaCadastradoException;
import br.edu.ufersa.smh.paciente.exception.PacienteNaoEncontradoException;
import br.edu.ufersa.smh.sensor.exception.SensorJaCadastradoException;
import br.edu.ufersa.smh.sensor.exception.SensorNaoEncontradoException;
import br.edu.ufersa.smh.usuario.exception.LoginEmUsoException;
import br.edu.ufersa.smh.usuario.exception.UsuarioJaCadastradoException;
import br.edu.ufersa.smh.usuario.exception.UsuarioNaoEncontradoException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.Instant;
import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    public record CampoInvalido(String campo, String mensagem) {
    }

    // 404

    @ExceptionHandler({
            UsuarioNaoEncontradoException.class,
            CpfNaoEncontradoException.class,
            PacienteNaoEncontradoException.class,
            LeitoNaoEncontradoException.class,
            SensorNaoEncontradoException.class,
            LeituraNaoEncontradaException.class
    })
    public ProblemDetail handleNaoEncontrado(RuntimeException ex) {
        return problem(HttpStatus.NOT_FOUND, "Recurso não encontrado", ex.getMessage());
    }

    // 409

    @ExceptionHandler({
            LoginEmUsoException.class,
            UsuarioJaCadastradoException.class,
            CpfJaCadastradoException.class,
            PacienteJaCadastradoException.class,
            LeitoJaCadastradoException.class,
            SensorJaCadastradoException.class,
            LeitoOcupadoException.class,
            PacienteComSensoresException.class
    })
    public ProblemDetail handleConflito(RuntimeException ex) {
        return problem(HttpStatus.CONFLICT, "Conflito de estado", ex.getMessage());
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleIntegridade(DataIntegrityViolationException ex) {
        log.warn("Violação de integridade no banco: {}", ex.getMostSpecificCause().getMessage());
        return problem(HttpStatus.CONFLICT, "Violação de integridade",
                "A operação viola uma restrição de dados (registro duplicado ou em uso).");
    }

    // 400 (validação)

    /** @Valid em @RequestBody */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {

        List<CampoInvalido> erros = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> new CampoInvalido(e.getField(), e.getDefaultMessage()))
                .toList();

        return ResponseEntity.badRequest().body(validationProblem(erros));
    }

    /** Constraints em @PathVariable / @RequestParam (ex.: @NotNull no PacienteController) */
    @Override
    protected ResponseEntity<Object> handleHandlerMethodValidationException(
            HandlerMethodValidationException ex, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {

        List<CampoInvalido> erros = ex.getParameterValidationResults().stream()
                .flatMap(r -> r.getResolvableErrors().stream()
                        .map(e -> new CampoInvalido(
                                r.getMethodParameter().getParameterName(),
                                e.getDefaultMessage())))
                .toList();

        return ResponseEntity.badRequest().body(validationProblem(erros));
    }

    /** @Validated na classe do controller (ex.: AdminController) */
    @ExceptionHandler(ConstraintViolationException.class)
    public ProblemDetail handleConstraintViolation(ConstraintViolationException ex) {
        List<CampoInvalido> erros = ex.getConstraintViolations().stream()
                .map(v -> new CampoInvalido(v.getPropertyPath().toString(), v.getMessage()))
                .toList();

        return validationProblem(erros);
    }

    // 401 / 403

    @ExceptionHandler(AccessDeniedException.class)
    public ProblemDetail handleAcessoNegado(AccessDeniedException ex) {
        return problem(HttpStatus.FORBIDDEN, "Acesso negado",
                "Você não tem permissão para executar esta operação.");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ProblemDetail handleNaoAutenticado(AuthenticationException ex) {
        return problem(HttpStatus.UNAUTHORIZED, "Não autenticado",
                "Credenciais ausentes ou inválidas.");
    }

    // 500

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleInesperado(Exception ex) {
        log.error("Erro inesperado", ex);
        return problem(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno",
                "Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }

    private ProblemDetail validationProblem(List<CampoInvalido> erros) {
        ProblemDetail pd = problem(HttpStatus.BAD_REQUEST, "Requisição inválida",
                "Um ou mais campos não passaram na validação.");
        pd.setProperty("erros", erros);
        return pd;
    }

    private ProblemDetail problem(HttpStatus status, String title, String detail) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        pd.setProperty("timestamp", Instant.now());
        return pd;
    }
}