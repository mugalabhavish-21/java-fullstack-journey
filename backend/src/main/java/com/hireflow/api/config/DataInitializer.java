package com.hireflow.api.config;

import com.hireflow.api.job.Job;
import com.hireflow.api.job.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedJobs(JobRepository repository) {
        return args -> {
            if (repository.count() > 0) return;
            repository.save(new Job("React Frontend Developer", "Nova Labs", "Hyderabad", "Full Time", "Fresher", "₹4.5–6 LPA", "React,JavaScript,REST API", "Build responsive interfaces and reusable React components."));
            repository.save(new Job("Full Stack Developer", "Helical IT Solutions", "Hyderabad", "Full Time", "Fresher", "₹3.5 LPA", "HTML,CSS,React,Spring Boot", "Work on modern web applications and REST APIs."));
            repository.save(new Job("Java Developer Intern", "CodeCraft Systems", "Bengaluru", "Internship", "Intern", "₹20k / month", "Java,Spring Boot,SQL", "Develop REST services and integrate frontend applications."));
            repository.save(new Job("UI Engineer", "PixelWorks", "Pune", "Full Time", "Junior", "₹5–7 LPA", "React,CSS,Figma", "Translate product designs into accessible React components."));
            repository.save(new Job("Frontend Engineer", "CloudNest", "Remote", "Full Time", "Junior", "₹6–9 LPA", "React,TypeScript,Testing", "Create scalable frontend modules with clean architecture."));
            repository.save(new Job("Web Developer Intern", "BrightByte", "Hyderabad", "Internship", "Intern", "₹15k / month", "HTML,CSS,JavaScript", "Build and maintain responsive web pages."));
        };
    }
}
