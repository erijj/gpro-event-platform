package com.gpro.backend.repository;

import com.gpro.backend.entity.Event;
import com.gpro.backend.entity.Registration;
import com.gpro.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    List<Registration> findByUser(User user);
    List<Registration> findByEvent(Event event);
    Optional<Registration> findByUserAndEvent(User user, Event event);
    long countByEvent(Event event);
}