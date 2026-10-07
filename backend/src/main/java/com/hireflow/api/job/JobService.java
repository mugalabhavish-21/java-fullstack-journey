package com.hireflow.api.job;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class JobService {
    private final JobRepository repository;

    public JobService(JobRepository repository) { this.repository = repository; }

    public Page<Job> getJobs(String q, String location, String type,
                             int page, int size, String sortBy, String direction) {
        String safeSort = switch (sortBy == null ? "" : sortBy) {
            case "title", "company", "location", "type", "level" -> sortBy;
            default -> "id";
        };
        Sort.Direction sortDirection =
                "desc".equalsIgnoreCase(direction) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(
                Math.max(page, 0), Math.min(Math.max(size, 1), 50),
                Sort.by(sortDirection, safeSort)
        );
        return repository.search(
                q == null ? "" : q.trim(),
                location == null ? "" : location.trim(),
                type == null ? "" : type.trim(),
                pageable
        );
    }

    public Job getJob(Long id) {
        return repository.findById(id).orElseThrow(() -> new JobNotFoundException(id));
    }

    public Job create(Job job) { job.setId(null); return repository.save(job); }

    public Job update(Long id, Job incoming) {
        Job job = getJob(id);
        job.setTitle(incoming.getTitle()); job.setCompany(incoming.getCompany());
        job.setLocation(incoming.getLocation()); job.setType(incoming.getType());
        job.setLevel(incoming.getLevel()); job.setSalary(incoming.getSalary());
        job.setSkills(incoming.getSkills()); job.setDescription(incoming.getDescription());
        return repository.save(job);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new JobNotFoundException(id);
        repository.deleteById(id);
    }

    public JobStats getStats() {
        return new JobStats(
                repository.count(),
                repository.countByTypeIgnoreCase("Full Time"),
                repository.countByTypeIgnoreCase("Internship"),
                repository.search("", "Remote", "", PageRequest.of(0, 1)).getTotalElements()
        );
    }
}