package com.hireflow.api.job;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobRepository extends JpaRepository<Job, Long> {
    @Query("""
        select j from Job j
        where (:q is null or :q = '' or
               lower(j.title) like lower(concat('%', :q, '%')) or
               lower(j.company) like lower(concat('%', :q, '%')) or
               lower(j.skills) like lower(concat('%', :q, '%')))
          and (:location is null or :location = '' or :location = 'All' or lower(j.location) = lower(:location))
          and (:type is null or :type = '' or :type = 'All' or lower(j.type) = lower(:type))
        """)
    Page<Job> search(@Param("q") String query, @Param("location") String location,
                     @Param("type") String type, Pageable pageable);

    long countByTypeIgnoreCase(String type);
}