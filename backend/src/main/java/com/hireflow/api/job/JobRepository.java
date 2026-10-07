package com.hireflow.api.job;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobRepository extends JpaRepository<Job, Long> {

    @Query("""
        select j from Job j
        where lower(j.title) like lower(concat('%', :q, '%'))
           or lower(j.company) like lower(concat('%', :q, '%'))
           or lower(j.skills) like lower(concat('%', :q, '%'))
        """)
    Page<Job> search(@Param("q") String query, Pageable pageable);

    Page<Job> findByLocationIgnoreCase(String location, Pageable pageable);

    Page<Job> findByTypeIgnoreCase(String type, Pageable pageable);

    long countByTypeIgnoreCase(String type);
}
