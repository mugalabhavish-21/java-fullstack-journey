package com.hireflow.api.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByEmailOrderByCreatedAtDesc(String email);
    Optional<Notification> findByIdAndEmail(Long id, String email);
}
