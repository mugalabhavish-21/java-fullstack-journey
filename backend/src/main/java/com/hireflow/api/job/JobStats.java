package com.hireflow.api.job;

public record JobStats(
        long totalJobs,
        long fullTimeJobs,
        long internshipJobs,
        long remoteJobs
) {}
