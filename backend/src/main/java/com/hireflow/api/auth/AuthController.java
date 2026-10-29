package com.hireflow.api.auth;

import com.hireflow.api.user.AppUser;
import com.hireflow.api.user.AppUserRepository;
import com.hireflow.api.user.Role;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://hireflow-react-interview.vercel.app"})
public class AuthController {
    private final AppUserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(AppUserRepository users, PasswordEncoder encoder, JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (users.findByEmailIgnoreCase(email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setName(request.name().trim());
        user.setPassword(encoder.encode(request.password()));
        // Public self-registration must never grant recruiter privileges.
        user.setRole(Role.APPLICANT);

        try {
            users.saveAndFlush(user);
        } catch (DataIntegrityViolationException ex) {
            // Handles the race where two registrations pass the prior existence check.
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }
        return loginInternal(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        String password = request.password();
        String roleValue = request.role() == null || request.role().isBlank()
                ? "APPLICANT"
                : request.role().toUpperCase(Locale.ROOT);

        final Role requestedRole;
        try {
            requestedRole = Role.valueOf(roleValue);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials for selected role"));
        }

        AppUser user = users.findByEmailIgnoreCase(email).orElse(null);
        if (user == null || !encoder.matches(password, user.getPassword()) || user.getRole() != requestedRole) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials for selected role"));
        }
        return loginInternal(user);
    }

    private ResponseEntity<?> loginInternal(AppUser user) {
        return ResponseEntity.ok(Map.of(
                "token", jwt.generate(user.getEmail(), user.getRole().name()),
                "user", Map.of("name", user.getName(), "email", user.getEmail(), "role", user.getRole().name())
        ));
    }
}
