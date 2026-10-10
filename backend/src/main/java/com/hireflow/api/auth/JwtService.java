package com.hireflow.api.auth;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;

public class JwtService {
    private static final String SECRET = System.getenv().getOrDefault(
            "JWT_SECRET", "HireFlow-local-development-secret-change-before-production-2026");

    public String generate(String email, String role) {
        String payload = Base64.getUrlEncoder().withoutPadding().encodeToString(
                (email + "|" + role + "|" + Instant.now().plusSeconds(86400).getEpochSecond())
                        .getBytes(StandardCharsets.UTF_8));
        return payload + "." + sign(payload);
    }

    public String email(String token) { return parse(token)[0]; }
    public String role(String token) { return parse(token)[1]; }

    private String[] parse(String token) {
        try {
            String[] parts = token.split("\\.", 2);
            if (parts.length != 2 || !parts[1].equals(sign(parts[0]))) {
                throw new IllegalArgumentException();
            }
            String[] payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8)
                    .split("\\|", 3);
            if (payload.length != 3 || Long.parseLong(payload[2]) < Instant.now().getEpochSecond()) {
                throw new IllegalArgumentException();
            }
            return payload;
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid or expired token");
        }
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException(ex);
        }
    }
}
