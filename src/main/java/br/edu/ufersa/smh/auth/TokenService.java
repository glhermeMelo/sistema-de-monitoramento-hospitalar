package br.edu.ufersa.smh.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class TokenService {
    @Value("${JWT_SECRET}")
    private String secret;

    @Value("${JWT_ISSUER:smh}")
    private String issuer;

    public String generateToken(String login, String role) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        return JWT.create()
                .withIssuer(issuer)
                .withSubject(login)
                .withClaim("role", role)
                .withExpiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                .sign(algorithm);
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer(issuer)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }
}
