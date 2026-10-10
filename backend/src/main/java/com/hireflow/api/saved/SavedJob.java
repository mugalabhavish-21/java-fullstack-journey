package com.hireflow.api.saved;

import jakarta.persistence.*;

@Entity
@Table(name = "saved_jobs", uniqueConstraints = @UniqueConstraint(columnNames = {"jobId", "email"}))
public class SavedJob {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long jobId;
    private String email;

    public SavedJob() {}

    public Long getId() { return id; }
    public Long getJobId() { return jobId; }
    public String getEmail() { return email; }

    public void setId(Long id) { this.id = id; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public void setEmail(String email) { this.email = email; }
}
