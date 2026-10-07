package com.hireflow.api.profile;
import com.hireflow.api.user.*; import org.springframework.web.bind.annotation.*; import java.util.Map;
@RestController @RequestMapping("/api/profile") public class ProfileController {
 private final AppUserRepository users; public ProfileController(AppUserRepository u){users=u;}
 private AppUser me(String email){return users.findByEmailIgnoreCase(email).orElseThrow();}
 @GetMapping public Map<String,Object> get(@RequestHeader("X-User-Email") String email){AppUser u=me(email);return Map.of("name",u.getName(),"email",u.getEmail(),"role",u.getRole(),"phone",n(u.getPhone()),"skills",n(u.getSkills()),"education",n(u.getEducation()),"experience",n(u.getExperience()),"resumeUrl",n(u.getResumeUrl()));}
 @PutMapping public Map<String,Object> update(@RequestHeader("X-User-Email") String email,@RequestBody Map<String,String> b){AppUser u=me(email);u.setName(b.getOrDefault("name",u.getName()));u.setPhone(b.getOrDefault("phone",u.getPhone()));u.setSkills(b.getOrDefault("skills",u.getSkills()));u.setEducation(b.getOrDefault("education",u.getEducation()));u.setExperience(b.getOrDefault("experience",u.getExperience()));u.setResumeUrl(b.getOrDefault("resumeUrl",u.getResumeUrl()));users.save(u);return get(email);}
 private String n(String s){return s==null?"":s;}
}