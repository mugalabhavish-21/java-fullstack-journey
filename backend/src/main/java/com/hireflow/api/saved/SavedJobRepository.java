package com.hireflow.api.saved;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByEmail(String email);
    Optional<SavedJob> findByJobIdAndEmail(Long jobId, String email);
}
