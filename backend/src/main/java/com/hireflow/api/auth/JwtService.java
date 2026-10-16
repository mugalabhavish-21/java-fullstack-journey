package com.hireflow.api.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Set;

/**
 * Issues and validates standard compact JWS JWTs signed with HS256.
 *
 * A production deployment must supply JWT_SECRET. The development fallback
 * is only used when the "prod" Spring profile is not active.
 */
@Component
public class JwtService {
    private static final String ISSUER = "hireflow";
    private static final long TOKEN_LIFETIME_SECONDS = 86_400;
    private static final Set<String> ALLOWED_ROLES = Set.of("APPLICANT", "RECRUITER");
    private static final String LOCAL_DEVELOPMENT_SECRET =
            "local-only-hireflow-development-secret-do-not-use-in-production";

    private final SecretKey signingKey;

    @Autowired
    public JwtService(Environment environment) {
        this(resolveSecret(environment));
    }

    public JwtService(String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET must not be empty");
        }
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET must be at least 32 bytes for HS256");
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    private static String resolveSecret(Environment environment) {
        String configured = environment.getProperty("JWT_SECRET");
        if (configured != null && !configured.isBlank()) {
            return configured;
        }

        for (String profile : environment.getActiveProfiles()) {
            if ("prod".equals(profile)) {
                throw new IllegalStateException(
                        "JWT_SECRET is required when the prod profile is active");
            }
        }
        return LOCAL_DEVELOPMENT_SECRET;
    }

    public String generate(String email, String role) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Token subject email is required");
        }
        if (role == null || !ALLOWED_ROLES.contains(role)) {
            throw new IllegalArgumentException("Unsupported token role");
        }

        Instant now = Instant.now();
        return Jwts.builder()
                .issuer(ISSUER)
                .subject(email)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(TOKEN_LIFETIME_SECONDS)))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public Claims parseClaims(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .requireIssuer(ISSUER)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String subject = claims.getSubject();
            String role = claims.get("role", String.class);
            if (subject == null || subject.isBlank() || role == null || !ALLOWED_ROLES.contains(role)) {
                throw new IllegalArgumentException("Required JWT claims are missing or invalid");
            }
            return claims;
        } catch (JwtException | IllegalArgumentException exception) {
            throw new IllegalArgumentException("Invalid or expired token", exception);
        }
    }

    public String email(String token) {
        return parseClaims(token).getSubject();
    }

    public String role(String token) {
        return parseClaims(token).get("role", String.class);
    }
}
