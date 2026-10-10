package com.hireflow.api.notification;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:5173", "https://hireflow-react-interview.vercel.app"})
public class NotificationController {
    private final NotificationRepository repository;

    public NotificationController(NotificationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('APPLICANT', 'RECRUITER')")
    public List<Notification> mine(Authentication authentication) {
        return repository.findByEmailOrderByCreatedAtDesc(authentication.getName());
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('APPLICANT', 'RECRUITER')")
    public Notification markRead(@PathVariable Long id, Authentication authentication) {
        Notification notification = repository.findByIdAndEmail(id, authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Notification not found"));
        notification.setReadFlag(true);
        return repository.save(notification);
    }
}
