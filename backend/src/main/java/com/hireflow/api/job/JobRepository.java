package com.hireflow.api.job;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    @Query("select j from Job j where lower(j.title) like lower(concat('%', :q, '%')) " +
           "or lower(j.company) like lower(concat('%', :q, '%')) " +
           "or lower(j.skills) like lower(concat('%', :q, '%'))")
    List<Job> search(@Param("q") String query);

    List<Job> findByLocationIgnoreCase(String location);
    List<Job> findByTypeIgnoreCase(String type);
}
