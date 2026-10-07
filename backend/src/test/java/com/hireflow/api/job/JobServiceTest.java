package com.hireflow.api.job;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {
    @Mock private JobRepository repository;
    @InjectMocks private JobService service;

    @Test
    void shouldSearchJobsWithPaginationAndFilters() {
        Pageable pageable = PageRequest.of(0, 6);
        Job job = new Job("Java Developer", "HireFlow", "Hyderabad",
                "Full Time", "Fresher", "₹4 LPA", "Java,Spring Boot", "Build REST APIs");

        when(repository.search("java", "Hyderabad", "Full Time", pageable))
                .thenReturn(new PageImpl<>(java.util.List.of(job), pageable, 1));

        Page<Job> result = service.getJobs("java", "Hyderabad", "Full Time",
                0, 6, "title", "asc");

        assertEquals(1, result.getTotalElements());
        assertEquals("Java Developer", result.getContent().get(0).getTitle());
    }
}