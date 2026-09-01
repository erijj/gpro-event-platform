package com.gpro.backend.controller;

import com.gpro.backend.dto.EventDto;
import com.gpro.backend.dto.request.CreateEventRequest;
import com.gpro.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDto>> findAll() {
        return ResponseEntity.ok(eventService.findAll());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDto>> findUpcoming() {
        return ResponseEntity.ok(eventService.findUpcoming());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.findById(id));
    }

    @PostMapping
    public ResponseEntity<EventDto> create(@Valid @RequestBody CreateEventRequest request) {
        EventDto created = eventService.create(
                request.getTitre(),
                request.getDescription(),
                request.getDateHeure(),
                request.getLieu(),
                request.getCapaciteMax(),
                request.getImage(),
                request.getCategoryId()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
@PutMapping("/{id}")
public ResponseEntity<EventDto> update(@PathVariable Long id, @Valid @RequestBody CreateEventRequest request) {
    EventDto updated = eventService.update(
            id,
            request.getTitre(),
            request.getDescription(),
            request.getDateHeure(),
            request.getLieu(),
            request.getCapaciteMax(),
            request.getImage(),
            request.getCategoryId(),
            request.getStatut()
    );
    return ResponseEntity.ok(updated);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    eventService.delete(id);
    return ResponseEntity.noContent().build();
}
}