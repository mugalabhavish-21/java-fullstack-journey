package com.hireflow.api.application;

import com.hireflow.api.job.JobRepository;
import com.hireflow.api.notification.Notification;
import com.hireflow.api.notification.NotificationRepository;
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
    private final ApplicationRepository applications;
    private final JobRepository jobs;
    private final NotificationRepository notifications;

    public ApplicationController(ApplicationRepository applications, JobRepository jobs,
                                 NotificationRepository notifications) {
        this.applications = applications;
        this.jobs = jobs;
        this.notifications = notifications;
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('APPLICANT')")
    public List<JobApplication> mine(Authentication authentication) {
        return applications.findByCandidateEmailOrderByAppliedAtDesc(authentication.getName());
    }

    @GetMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public List<JobApplication> all() {
        return applications.findAll();
    }

    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<?> apply(@PathVariable Long jobId, Authentication authentication,
                                   @RequestBody(required = false) Map<String, String> body) {
        String email = authentication.getName();
        if (applications.findByJobIdAndCandidateEmail(jobId, email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Already applied"));
        }
        if (!jobs.existsById(jobId)) {
            return ResponseEntity.notFound().build();
        }

        JobApplication application = new JobApplication();
        application.setJobId(jobId);
        application.setCandidateEmail(email);
        if (body != null) application.setCoverNote(body.get("coverNote"));
        JobApplication saved = applications.save(application);

        Notification notification = new Notification();
        notification.setEmail(email);
        notification.setMessage("Your application for job #" + jobId + " was submitted successfully.");
        notifications.save(notification);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
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

        JobApplication application = applications.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        application.setStatus(status.name());
        JobApplication saved = applications.save(application);

        Notification notification = new Notification();
        notification.setEmail(application.getCandidateEmail());
        notification.setMessage("Your application for job #" + application.getJobId()
                + " has been updated to " + status.name().replace('_', ' ') + ".");
        notifications.save(notification);
        return saved;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('RECRUITER')")
    public Map<String, Long> stats() {
        return Map.of(
                "total", applications.count(),
                "applied", applications.countByStatus("APPLIED"),
                "review", applications.countByStatus("UNDER_REVIEW"),
                "shortlisted", applications.countByStatus("SHORTLISTED"),
                "interview", applications.countByStatus("INTERVIEW"),
                "selected", applications.countByStatus("SELECTED")
        );
    }
}
