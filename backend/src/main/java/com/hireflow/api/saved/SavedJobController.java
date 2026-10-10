package com.hireflow.api.saved;

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
@RequestMapping("/api/saved-jobs")
@CrossOrigin(origins = {"http://localhost:5173", "https://hireflow-react-interview.vercel.app"})
public class SavedJobController {
    private final SavedJobRepository savedJobs;
    private final JobRepository jobs;

    public SavedJobController(SavedJobRepository savedJobs, JobRepository jobs) {
        this.savedJobs = savedJobs;
        this.jobs = jobs;
    }

    @GetMapping
    @PreAuthorize("hasRole('APPLICANT')")
    public List<SavedJob> mine(Authentication authentication) {
        return savedJobs.findByEmail(authentication.getName());
    }

    @PostMapping("/{jobId}")
    @PreAuthorize("hasRole('APPLICANT')")
    public ResponseEntity<?> save(@PathVariable Long jobId, Authentication authentication) {
        String email = authentication.getName();
        if (!jobs.existsById(jobId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found");
        }
        if (savedJobs.findByJobIdAndEmail(jobId, email).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Already saved"));
        }
        SavedJob savedJob = new SavedJob();
        savedJob.setJobId(jobId);
        savedJob.setEmail(email);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedJobs.save(savedJob));
    }

    @DeleteMapping("/{jobId}")
    @PreAuthorize("hasRole('APPLICANT')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable Long jobId, Authentication authentication) {
        savedJobs.findByJobIdAndEmail(jobId, authentication.getName()).ifPresent(savedJobs::delete);
    }
}
