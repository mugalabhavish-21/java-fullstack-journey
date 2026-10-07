package com.hireflow.api.user;
import jakarta.persistence.*; import jakarta.validation.constraints.*;
@Entity @Table(name="app_users") public class AppUser {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Email @NotBlank @Column(unique=true) private String email;
 @NotBlank private String password; @NotBlank private String name;
 @Enumerated(EnumType.STRING) private Role role=Role.CANDIDATE;
 private String phone,skills,education,experience,resumeUrl;
 public AppUser(){} public Long getId(){return id;} public String getEmail(){return email;} public String getPassword(){return password;} public String getName(){return name;} public Role getRole(){return role;} public String getPhone(){return phone;} public String getSkills(){return skills;} public String getEducation(){return education;} public String getExperience(){return experience;} public String getResumeUrl(){return resumeUrl;}
 public void setId(Long v){id=v;} public void setEmail(String v){email=v;} public void setPassword(String v){password=v;} public void setName(String v){name=v;} public void setRole(Role v){role=v;} public void setPhone(String v){phone=v;} public void setSkills(String v){skills=v;} public void setEducation(String v){education=v;} public void setExperience(String v){experience=v;} public void setResumeUrl(String v){resumeUrl=v;}
}