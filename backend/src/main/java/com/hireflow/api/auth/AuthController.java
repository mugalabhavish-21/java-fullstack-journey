package com.hireflow.api.auth;
import com.hireflow.api.user.*;import org.springframework.http.*;import org.springframework.security.crypto.password.PasswordEncoder;import org.springframework.web.bind.annotation.*;import java.util.Map;
@RestController @RequestMapping("/api/auth") @CrossOrigin(origins={"http://localhost:5173","https://hireflow-react-interview.vercel.app"})
public class AuthController{
 private final AppUserRepository users;private final PasswordEncoder encoder;private final JwtService jwt=new JwtService();
 public AuthController(AppUserRepository u,PasswordEncoder e){users=u;encoder=e;}
 @PostMapping("/register") public ResponseEntity<?> register(@RequestBody AppUser u){if(users.findByEmailIgnoreCase(u.getEmail()).isPresent())return ResponseEntity.status(409).body(Map.of("message","Email already registered"));u.setPassword(encoder.encode(u.getPassword()));if(u.getRole()==null)u.setRole(Role.APPLICANT);users.save(u);return loginInternal(u);}
 @PostMapping("/login") public ResponseEntity<?> login(@RequestBody Map<String,String> b){var u=users.findByEmailIgnoreCase(b.getOrDefault("email","")).orElse(null);String role=b.getOrDefault("role","APPLICANT").toUpperCase();if(u==null||!encoder.matches(b.getOrDefault("password",""),u.getPassword())||u.getRole()!=Role.valueOf(role))return ResponseEntity.status(401).body(Map.of("message","Invalid credentials for selected role"));return loginInternal(u);}
 private ResponseEntity<?> loginInternal(AppUser u){return ResponseEntity.ok(Map.of("token",jwt.generate(u.getEmail(),u.getRole().name()),"user",Map.of("name",u.getName(),"email",u.getEmail(),"role",u.getRole().name())));}
}