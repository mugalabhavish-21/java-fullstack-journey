package com.hireflow.api.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins={"http://localhost:5173","https://hireflow-react-interview.vercel.app"})
public class AuthController {
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String,String> body) {
    String email=body.getOrDefault("email","").trim().toLowerCase();
    String password=body.getOrDefault("password","");
    String role=body.getOrDefault("role","").toUpperCase();
    boolean applicant="applicant@hireflow.com".equals(email) && "applicant123".equals(password) && "APPLICANT".equals(role);
    boolean recruiter="recruiter@hireflow.com".equals(email) && "recruiter123".equals(password) && "RECRUITER".equals(role);
    if(!applicant && !recruiter) return ResponseEntity.status(401).body(Map.of("message","Invalid credentials for selected role"));
    String name=applicant?"Demo Applicant":"Demo Recruiter";
    return ResponseEntity.ok(Map.of("token",UUID.randomUUID().toString(),"user",Map.of("name",name,"email",email,"role",role)));
  }
}