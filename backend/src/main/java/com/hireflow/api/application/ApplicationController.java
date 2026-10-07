package com.hireflow.api.application;
import org.springframework.web.bind.annotation.*; import org.springframework.http.*; import java.util.*;
@RestController @RequestMapping("/api/applications") public class ApplicationController {
 private final ApplicationRepository repo; public ApplicationController(ApplicationRepository r){repo=r;}
 @GetMapping public List<JobApplication> mine(@RequestHeader("X-User-Email") String email){return repo.findByCandidateEmailOrderByAppliedAtDesc(email);}
 @PostMapping("/{jobId}") public ResponseEntity<?> apply(@PathVariable Long jobId,@RequestHeader("X-User-Email") String email,@RequestBody(required=false) Map<String,String> body){if(repo.findByJobIdAndCandidateEmail(jobId,email).isPresent())return ResponseEntity.status(409).body(Map.of("message","Already applied"));JobApplication a=new JobApplication();a.setJobId(jobId);a.setCandidateEmail(email);if(body!=null)a.setCoverNote(body.get("coverNote"));repo.save(a);return ResponseEntity.status(201).body(a);}
 @PatchMapping("/{id}/status") public JobApplication status(@PathVariable Long id,@RequestBody Map<String,String> body){JobApplication a=repo.findById(id).orElseThrow();a.setStatus(body.getOrDefault("status","UNDER_REVIEW"));return repo.save(a);}
 @GetMapping("/stats") public Map<String,Long> stats(){return Map.of("total",repo.count(),"applied",repo.countByStatus("APPLIED"),"review",repo.countByStatus("UNDER_REVIEW"),"shortlisted",repo.countByStatus("SHORTLISTED"),"interview",repo.countByStatus("INTERVIEW"),"selected",repo.countByStatus("SELECTED"));}
}