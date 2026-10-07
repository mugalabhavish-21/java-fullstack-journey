package com.hireflow.api.application;
import jakarta.persistence.*; import java.time.LocalDateTime;
@Entity @Table(name="job_applications",uniqueConstraints=@UniqueConstraint(columnNames={"jobId","candidateEmail"}))
public class JobApplication { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long id; Long jobId; String candidateEmail; String status="APPLIED"; LocalDateTime appliedAt=LocalDateTime.now(); String coverNote;
 public JobApplication(){} public Long getId(){return id;} public Long getJobId(){return jobId;} public String getCandidateEmail(){return candidateEmail;} public String getStatus(){return status;} public LocalDateTime getAppliedAt(){return appliedAt;} public String getCoverNote(){return coverNote;} public void setId(Long v){id=v;} public void setJobId(Long v){jobId=v;} public void setCandidateEmail(String v){candidateEmail=v;} public void setStatus(String v){status=v;} public void setCoverNote(String v){coverNote=v;}
}