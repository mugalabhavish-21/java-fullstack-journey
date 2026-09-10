package com.hireflow.api.job;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {"http://localhost:5173", "https://hireflow-react-interview.vercel.app"})
public class JobController {
    private final JobService service;

    public JobController(JobService service) {
        this.service = service;
    }

    @GetMapping
    public List<Job> getJobs(@RequestParam(required = false) String q,
                             @RequestParam(required = false) String location,
                             @RequestParam(required = false) String type) {
        return service.getJobs(q, location, type);
    }

    @GetMapping("/{id}")
    public Job getJob(@PathVariable Long id) {
        return service.getJob(id);
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@Valid @RequestBody Job job) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(job));
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable Long id, @Valid @RequestBody Job job) {
        return service.update(id, job);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJob(@PathVariable Long id) {
        service.delete(id);
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<Map<String, Object>> apply(@PathVariable Long id) {
        Job job = service.getJob(id);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Application received",
                "jobId", job.getId(),
                "jobTitle", job.getTitle()
        ));
    }

    @ExceptionHandler(JobNotFoundException.class)
    public ResponseEntity<Map<String, String>> notFound(JobNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
    }
}
