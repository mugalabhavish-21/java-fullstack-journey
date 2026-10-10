package com.hireflow.api.interview;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long applicationId;
    private String candidateEmail;
    private OffsetDateTime scheduledAt;
    private String type;
    private String meetingLink;
    private String status = "SCHEDULED";

    public Interview() {}

    public Long getId() { return id; }
    public Long getApplicationId() { return applicationId; }
    public String getCandidateEmail() { return candidateEmail; }
    public OffsetDateTime getScheduledAt() { return scheduledAt; }
    public String getType() { return type; }
    public String getMeetingLink() { return meetingLink; }
    public String getStatus() { return status; }

    public void setApplicationId(Long value) { this.applicationId = value; }
    public void setCandidateEmail(String value) { this.candidateEmail = value; }
    public void setScheduledAt(OffsetDateTime value) { this.scheduledAt = value; }
    public void setType(String value) { this.type = value; }
    public void setMeetingLink(String value) { this.meetingLink = value; }
}
