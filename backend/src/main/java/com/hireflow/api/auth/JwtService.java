package com.hireflow.api.auth;
import io.jsonwebtoken.*; import io.jsonwebtoken.security.Keys; import org.springframework.stereotype.Service; import java.nio.charset.StandardCharsets; import java.security.Key; import java.util.Date;
@Service public class JwtService { private final Key key=Keys.hmacShaKeyFor("HireFlow-Production-Secret-Key-Change-Me-2026-At-Least-32".getBytes(StandardCharsets.UTF_8));
 public String token(String email,String role){return Jwts.builder().subject(email).claim("role",role).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+86400000)).signWith(key).compact();}
 public Claims claims(String token){return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();}
}