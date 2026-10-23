package com.hireflow.api.job;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class JobControllerTest {
    private JobService service;
    private JobController controller;

    @BeforeEach
    void setUp() {
        service = mock(JobService.class);
        controller = new JobController(service);
    }

    @Test
    void applyReturnsJobDetailsWhenJobExists() {
        Job job = new Job("Java Developer", "Example Co", "Hyderabad",
                "Full Time", "Junior", "₹4 LPA", "Java,Spring Boot", "Build APIs.");
        job.setId(7L);
        when(service.getJob(7L)).thenReturn(job);

        ResponseEntity<Map<String, Object>> response = controller.apply(7L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(true, response.getBody().get("success"));
        assertEquals(7L, response.getBody().get("jobId"));
        assertEquals("Java Developer", response.getBody().get("jobTitle"));
    }

    @Test
    void applyDoesNotReportSuccessWhenJobDoesNotExist() {
        JobNotFoundException exception = new JobNotFoundException(404L);
        when(service.getJob(404L)).thenThrow(exception);

        JobNotFoundException thrown = assertThrows(
                JobNotFoundException.class,
                () -> controller.apply(404L)
        );
        assertSame(exception, thrown);

        ResponseEntity<Map<String, String>> response = controller.notFound(thrown);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Job not found with id: 404", response.getBody().get("error"));
    }
}
