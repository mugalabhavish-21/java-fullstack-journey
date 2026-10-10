package com.hireflow.api.interview;

import com.hireflow.api.application.ApplicationRepository;
import com.hireflow.api.application.JobApplication;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = {"http://localhost:5173", "https://hireflow-react-interview.vercel.app"})
public class InterviewController {
    private final InterviewRepository interviews;
    private final ApplicationRepository applications;

    public InterviewController(InterviewRepository interviews, ApplicationRepository applications) {
        this.interviews = interviews;
        this.applications = applications;
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('APPLICANT')")
    public List<Interview> myInterviews(Authentication authentication) {
        return interviews.findByCandidateEmailOrderByScheduledAtDesc(authentication.getName());
    }

    @GetMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public List<Interview> allInterviews() {
        return interviews.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public Interview schedule(@RequestBody Map<String, String> body) {
        String applicationIdValue = body.get("applicationId");
        String scheduledAtValue = body.get("scheduledAt");
        if (applicationIdValue == null || scheduledAtValue == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "applicationId and scheduledAt are required");
        }

        final Long applicationId;
        final LocalDateTime scheduledAt;
        try {
            applicationId = Long.valueOf(applicationIdValue);
            scheduledAt = LocalDateTime.parse(scheduledAtValue);
        } catch (NumberFormatException | DateTimeParseException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "applicationId must be a number and scheduledAt must be ISO local date-time");
        }

        if (!scheduledAt.isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Interview time must be in the future");
        }

        JobApplication application = applications.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Application not found"));

        Interview interview = new Interview();
        interview.setApplicationId(application.getId());
        interview.setCandidateEmail(application.getCandidateEmail());
        interview.setScheduledAt(scheduledAt);
        interview.setType(body.getOrDefault("type", "Technical"));
        interview.setMeetingLink(body.getOrDefault("meetingLink", ""));
        return interviews.save(interview);
    }
}
