package com.hireflow.api.profile;

import com.hireflow.api.user.AppUser;
import com.hireflow.api.user.AppUserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = {"http://localhost:5173", "https://hireflow-react-interview.vercel.app"})
public class ProfileController {
    private final AppUserRepository users;

    public ProfileController(AppUserRepository users) {
        this.users = users;
    }

    public record ProfileResponse(String email, String name, String phone, String skills,
                                  String education, String experience, String resumeUrl) {}

    @GetMapping
    @PreAuthorize("hasRole('APPLICANT')")
    public ProfileResponse me(Authentication authentication) {
        return toResponse(users.findByEmailIgnoreCase(authentication.getName()).orElseThrow());
    }

    @PutMapping
    @PreAuthorize("hasRole('APPLICANT')")
    public ProfileResponse update(Authentication authentication, @RequestBody ProfileResponse input) {
        AppUser user = users.findByEmailIgnoreCase(authentication.getName()).orElseThrow();
        user.setName(input.name());
        user.setPhone(input.phone());
        user.setSkills(input.skills());
        user.setEducation(input.education());
        user.setExperience(input.experience());
        user.setResumeUrl(input.resumeUrl());
        return toResponse(users.save(user));
    }

    private ProfileResponse toResponse(AppUser user) {
        return new ProfileResponse(user.getEmail(), user.getName(), user.getPhone(),
                user.getSkills(), user.getEducation(), user.getExperience(), user.getResumeUrl());
    }
}
