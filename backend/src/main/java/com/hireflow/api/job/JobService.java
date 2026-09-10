package com.hireflow.api.job;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {
    private final JobRepository repository;

    public JobService(JobRepository repository) {
        this.repository = repository;
    }

    public List<Job> getJobs(String q, String location, String type) {
        List<Job> jobs;
        if (q != null && !q.isBlank()) {
            jobs = repository.search(q.trim());
        } else {
            jobs = repository.findAll();
        }
        if (location != null && !location.isBlank() && !location.equalsIgnoreCase("All")) {
            jobs = jobs.stream().filter(j -> j.getLocation().equalsIgnoreCase(location)).toList();
        }
        if (type != null && !type.isBlank() && !type.equalsIgnoreCase("All")) {
            jobs = jobs.stream().filter(j -> j.getType().equalsIgnoreCase(type)).toList();
        }
        return jobs;
    }

    public Job getJob(Long id) {
        return repository.findById(id).orElseThrow(() -> new JobNotFoundException(id));
    }

    public Job create(Job job) {
        job.setId(null);
        return repository.save(job);
    }

    public Job update(Long id, Job incoming) {
        Job job = getJob(id);
        job.setTitle(incoming.getTitle());
        job.setCompany(incoming.getCompany());
        job.setLocation(incoming.getLocation());
        job.setType(incoming.getType());
        job.setLevel(incoming.getLevel());
        job.setSalary(incoming.getSalary());
        job.setSkills(incoming.getSkills());
        job.setDescription(incoming.getDescription());
        return repository.save(job);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new JobNotFoundException(id);
        repository.deleteById(id);
    }
}
