package com.hireflow.api.config;

import com.hireflow.api.job.Job;
import com.hireflow.api.job.JobRepository;
import com.hireflow.api.user.AppUser;
import com.hireflow.api.user.AppUserRepository;
import com.hireflow.api.user.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner seedDemoData(JobRepository jobs, AppUserRepository users, PasswordEncoder encoder) {
        return args -> {
            if (jobs.count() == 0) {
                jobs.save(new Job("React Frontend Developer", "Nova Labs", "Hyderabad", "Full Time", "Fresher", "₹4.5–6 LPA", "React,JavaScript,REST API", "Build responsive interfaces and reusable React components."));
                jobs.save(new Job("Full Stack Developer", "Helical IT Solutions", "Hyderabad", "Full Time", "Fresher", "₹3.5 LPA", "HTML,CSS,React,Spring Boot", "Work on modern web applications and REST APIs."));
                jobs.save(new Job("Java Developer Intern", "CodeCraft Systems", "Bengaluru", "Internship", "Intern", "₹20k / month", "Java,Spring Boot,SQL", "Develop REST services and integrate frontend applications."));
                jobs.save(new Job("UI Engineer", "PixelWorks", "Pune", "Full Time", "Junior", "₹5–7 LPA", "React,CSS,Figma", "Translate product designs into accessible React components."));
                jobs.save(new Job("Frontend Engineer", "CloudNest", "Remote", "Full Time", "Junior", "₹6–9 LPA", "React,TypeScript,Testing", "Create scalable frontend modules with clean architecture."));
                jobs.save(new Job("Web Developer Intern", "BrightByte", "Hyderabad", "Internship", "Intern", "₹15k / month", "HTML,CSS,JavaScript", "Build and maintain responsive web pages."));
            }

            if (users.findByEmailIgnoreCase("applicant@hireflow.com").isEmpty()) {
                AppUser applicant = new AppUser();
                applicant.setEmail("applicant@hireflow.com");
                applicant.setPassword(encoder.encode("applicant123"));
                applicant.setName("Demo Applicant");
                applicant.setRole(Role.APPLICANT);
                users.save(applicant);
            }
            if (users.findByEmailIgnoreCase("recruiter@hireflow.com").isEmpty()) {
                AppUser recruiter = new AppUser();
                recruiter.setEmail("recruiter@hireflow.com");
                recruiter.setPassword(encoder.encode("recruiter123"));
                recruiter.setName("Demo Recruiter");
                recruiter.setRole(Role.RECRUITER);
                users.save(recruiter);
            }
        };
    }
}
