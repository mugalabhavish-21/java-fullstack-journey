package com.hireflow.api.application;

import com.hireflow.api.job.JobRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:5173", "https://hireflow-react-interview.vercel.app"})
public class ApplicationController {
    private final ApplicationRepository repo;
    private final JobRepository jobs;

    public ApplicationController(ApplicationRepository repo, JobRepository jobs) {
        this.repo = repo;
        this.jobs = jobs;
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('APPLICANT')")
    public List<JobApplication> mine(Authentication authentication) {
        return repo.findByCandidateEmailOrderByAppliedAtDesc(authentication.getName());
    }

    @GetMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public List<JobApplication> all() {
        return repo.findAll();
    }

    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<?> apply(@PathVariable Long jobId, Authentication authentication,
                                  @RequestBody(required = false) Map<String, String> body) {
        String email = authentication.getName();
        if (repo.findByJobIdAndCandidateEmail(jobId, email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Already applied"));
        }
        if (!jobs.existsById(jobId)) {
            return ResponseEntity.notFound().build();
        }

        JobApplication application = new JobApplication();
        application.setJobId(jobId);
        application.setCandidateEmail(email);
        if (body != null) {
            application.setCoverNote(body.get("coverNote"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(application));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public JobApplication status(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String requestedStatus = body == null ? null : body.get("status");
        if (requestedStatus == null || requestedStatus.isBlank()) {
            throw new IllegalArgumentException("status is required");
        }

        final ApplicationStatus status;
        try {
            status = ApplicationStatus.valueOf(requestedStatus);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "Unsupported status. Allowed values: APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW, SELECTED, REJECTED");
        }

        JobApplication application = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Application not found"));
        application.setStatus(status.name());
        return repo.save(application);
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('RECRUITER')")
    public Map<String, Long> stats() {
        return Map.of(
                "total", repo.count(),
                "applied", repo.countByStatus("APPLIED"),
                "review", repo.countByStatus("UNDER_REVIEW"),
                "shortlisted", repo.countByStatus("SHORTLISTED"),
                "interview", repo.countByStatus("INTERVIEW"),
                "selected", repo.countByStatus("SELECTED")
        );
    }
}
