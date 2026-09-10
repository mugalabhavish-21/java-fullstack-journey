package com.hireflow.api.job;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;
    @NotBlank
    private String company;
    @NotBlank
    private String location;
    @NotBlank
    private String type;
    private String level;
    private String salary;
    private String skills;
    private String description;

    public Job() {}

    public Job(String title, String company, String location, String type, String level,
                String salary, String skills, String description) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.type = type;
        this.level = level;
        this.salary = salary;
        this.skills = skills;
        this.description = description;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getLocation() { return location; }
    public String getType() { return type; }
    public String getLevel() { return level; }
    public String getSalary() { return salary; }
    public String getSkills() { return skills; }
    public String getDescription() { return description; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setCompany(String company) { this.company = company; }
    public void setLocation(String location) { this.location = location; }
    public void setType(String type) { this.type = type; }
    public void setLevel(String level) { this.level = level; }
    public void setSalary(String salary) { this.salary = salary; }
    public void setSkills(String skills) { this.skills = skills; }
    public void setDescription(String description) { this.description = description; }
}
