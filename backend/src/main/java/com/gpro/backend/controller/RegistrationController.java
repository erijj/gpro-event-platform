package com.gpro.backend.controller;

import com.gpro.backend.dto.RegistrationDto;
import com.gpro.backend.dto.request.InscrireRequest;
import com.gpro.backend.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RegistrationDto>> findByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(registrationService.findByUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistrationDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(registrationService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<RegistrationDto>> findAll() {
        return ResponseEntity.ok(registrationService.findAll());
    }
    
    @PostMapping
    public ResponseEntity<RegistrationDto> inscrire(@Valid @RequestBody InscrireRequest request) {
        RegistrationDto created = registrationService.inscrire(request.getUserId(), request.getEventId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> annuler(@PathVariable Long id) {
        registrationService.annuler(id);
        return ResponseEntity.noContent().build();
    }
}