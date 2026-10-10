package com.hireflow.api.auth;

import com.hireflow.api.user.AppUser;
import com.hireflow.api.user.AppUserRepository;
import com.hireflow.api.user.Role;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://hireflow-react-interview.vercel.app"})
public class AuthController {
    private final AppUserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt = new JwtService();

    public AuthController(AppUserRepository users, PasswordEncoder encoder) {
        this.users = users;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AppUser user) {
        if (users.findByEmailIgnoreCase(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already registered"));
        }
        user.setEmail(user.getEmail().trim().toLowerCase());
        user.setPassword(encoder.encode(user.getPassword()));
        // Public self-registration must never grant recruiter privileges.
        user.setRole(Role.APPLICANT);
        users.save(user);
        return loginInternal(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.getOrDefault("email", "").trim();
        String password = body.getOrDefault("password", "");
        Role requestedRole;
        try {
            requestedRole = Role.valueOf(body.getOrDefault("role", "APPLICANT").toUpperCase());
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
