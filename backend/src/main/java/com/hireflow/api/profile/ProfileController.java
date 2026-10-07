package com.hireflow.api.profile;
import com.hireflow.api.user.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/profile") @CrossOrigin(origins={"http://localhost:5173","https://hireflow-react-interview.vercel.app"})
public class ProfileController {
 private final AppUserRepository users; public ProfileController(AppUserRepository u){users=u;}
 @GetMapping @PreAuthorize("hasRole('APPLICANT')") public AppUser me(Authentication a){return users.findByEmailIgnoreCase(a.getName()).orElseThrow();}
 @PutMapping @PreAuthorize("hasRole('APPLICANT')") public AppUser update(Authentication a,@RequestBody AppUser x){var u=users.findByEmailIgnoreCase(a.getName()).orElseThrow();u.setName(x.getName());u.setPhone(x.getPhone());u.setSkills(x.getSkills());u.setEducation(x.getEducation());u.setExperience(x.getExperience());u.setResumeUrl(x.getResumeUrl());return users.save(u);}
}