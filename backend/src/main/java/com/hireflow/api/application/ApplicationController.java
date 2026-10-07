package com.hireflow.api.application;
import com.hireflow.api.user.AppUserRepository;
import com.hireflow.api.job.JobRepository;
import org.springframework.web.bind.annotation.*; import org.springframework.http.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.security.core.Authentication; import java.util.*;
@RestController @RequestMapping("/api/applications") @CrossOrigin(origins={"http://localhost:5173","https://hireflow-react-interview.vercel.app"})
public class ApplicationController {
 private final ApplicationRepository repo; private final JobRepository jobs; private final AppUserRepository users;
 public ApplicationController(ApplicationRepository r,JobRepository j,AppUserRepository u){repo=r;jobs=j;users=u;}
 @GetMapping("/mine") @PreAuthorize("hasRole('APPLICANT')") public List<JobApplication> mine(Authentication a){return repo.findByCandidateEmailOrderByAppliedAtDesc(a.getName());}
 @GetMapping @PreAuthorize("hasRole('RECRUITER')") public List<JobApplication> all(){return repo.findAll();}
 @PostMapping("/{jobId}") @PreAuthorize("hasRole('APPLICANT')") public ResponseEntity<?> apply(@PathVariable Long jobId,Authentication a,@RequestBody(required=false) Map<String,String> body){
  String email=a.getName(); if(repo.findByJobIdAndCandidateEmail(jobId,email).isPresent()) return ResponseEntity.status(409).body(Map.of("message","Already applied"));
  if(!jobs.existsById(jobId)) return ResponseEntity.notFound().build(); JobApplication x=new JobApplication();x.setJobId(jobId);x.setCandidateEmail(email);if(body!=null)x.setCoverNote(body.get("coverNote"));repo.save(x);return ResponseEntity.status(201).body(x);
 }
 @PatchMapping("/{id}/status") @PreAuthorize("hasRole('RECRUITER')") public JobApplication status(@PathVariable Long id,@RequestBody Map<String,String> body){var x=repo.findById(id).orElseThrow();x.setStatus(body.getOrDefault("status","UNDER_REVIEW"));return repo.save(x);}
 @GetMapping("/stats") @PreAuthorize("hasRole('RECRUITER')") public Map<String,Long> stats(){return Map.of("total",repo.count(),"applied",repo.countByStatus("APPLIED"),"review",repo.countByStatus("UNDER_REVIEW"),"shortlisted",repo.countByStatus("SHORTLISTED"),"interview",repo.countByStatus("INTERVIEW"),"selected",repo.countByStatus("SELECTED"));}
}