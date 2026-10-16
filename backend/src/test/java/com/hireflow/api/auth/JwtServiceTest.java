package com.hireflow.api.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {
    private static final String SECRET =
            "test-secret-for-hireflow-jwt-tests-at-least-32-bytes-long";

    @Test
    void generatesStandardThreePartJwtWithExpectedClaims() {
        JwtService service = new JwtService(SECRET);

        String token = service.generate("applicant@example.com", "APPLICANT");
        String[] parts = token.split("\\.", -1);
        Claims claims = service.parseClaims(token);

        assertEquals(3, parts.length);
        assertEquals("applicant@example.com", claims.getSubject());
        assertEquals("APPLICANT", claims.get("role", String.class));
        assertEquals("hireflow", claims.getIssuer());
        assertTrue(claims.getExpiration().after(new Date()));
    }

    @Test
    void rejectsTokenSignedByDifferentSecret() {
        String token = new JwtService(SECRET).generate("applicant@example.com", "APPLICANT");
        JwtService otherService = new JwtService(
                "a-different-test-secret-for-hireflow-that-is-also-long-enough");

        assertThrows(IllegalArgumentException.class, () -> otherService.parseClaims(token));
    }

    @Test
    void rejectsExpiredJwt() {
        JwtService service = new JwtService(SECRET);
        Instant now = Instant.now();
        var key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
        String expired = Jwts.builder()
                .issuer("hireflow")
                .subject("applicant@example.com")
                .claim("role", "APPLICANT")
                .issuedAt(Date.from(now.minusSeconds(120)))
                .expiration(Date.from(now.minusSeconds(60)))
                .signWith(key, Jwts.SIG.HS256)
                .compact();

        assertThrows(IllegalArgumentException.class, () -> service.parseClaims(expired));
    }

    @Test
    void productionProfileRequiresSecret() {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles("prod");

        IllegalStateException exception =
                assertThrows(IllegalStateException.class, () -> new JwtService(environment));
        assertTrue(exception.getMessage().contains("JWT_SECRET"));
    }

    @Test
    void rejectsWeakSecrets() {
        assertThrows(IllegalStateException.class, () -> new JwtService("too-short"));
    }

    @Test
    void refusesUnknownRolesWhenGeneratingTokens() {
        JwtService service = new JwtService(SECRET);

        assertThrows(IllegalArgumentException.class,
                () -> service.generate("candidate@example.com", "ADMIN"));
    }
}
