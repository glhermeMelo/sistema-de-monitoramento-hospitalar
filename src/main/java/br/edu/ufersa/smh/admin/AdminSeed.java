package br.edu.ufersa.smh.admin;

import br.edu.ufersa.smh.admin.model.Admin;
import br.edu.ufersa.smh.common.vo.Cpf;
import br.edu.ufersa.smh.common.vo.Login;
import br.edu.ufersa.smh.common.vo.Nome;
import br.edu.ufersa.smh.common.vo.Senha;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeed {

    @Bean
    public CommandLineRunner seedAdmin(AdminRepository repository, PasswordEncoder encoder) {
        return args -> {
            if (repository.count() > 0) return;

            Admin admin = new Admin(
                    null,
                    new Nome("Admin"),
                    new Cpf("52998224725"),
                    new Login("admin"),
                    new Senha(encoder.encode("Admin@123"))
            );
            repository.save(admin);
        };
    }
}
