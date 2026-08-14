package com.gpro.backend.repository;

import com.gpro.backend.entity.Category;
import com.gpro.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategory(Category category);
    List<Event> findByDateHeureAfter(LocalDateTime date);
}